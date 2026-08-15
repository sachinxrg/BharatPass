package com.bharatpass.vault.service;

import com.bharatpass.common.util.MaskingUtil;
import com.bharatpass.vault.entity.AadhaarVaultEntry;
import com.bharatpass.vault.repository.AadhaarVaultRepository;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Service;

import javax.crypto.Cipher;
import javax.crypto.SecretKey;
import javax.crypto.spec.GCMParameterSpec;
import javax.crypto.spec.SecretKeySpec;
import java.nio.charset.StandardCharsets;
import java.security.SecureRandom;
import java.util.Base64;
import java.util.UUID;

/**
 * UIDAI-Compliant Aadhaar Data Vault Service.
 * Raw Aadhaar numbers are NEVER stored in plaintext.
 * All storage uses AES-256-GCM encryption with a master key.
 * Applications only receive a UUIDv4 reference key.
 */
@Service
public class AadhaarVaultService {

    private static final String ALGORITHM = "AES/GCM/NoPadding";
    private static final int GCM_TAG_LENGTH = 128;
    private static final int GCM_IV_LENGTH = 12;
    private static final String KEY_ID = "master-key-v1";

    private final AadhaarVaultRepository vaultRepository;
    private final SecretKey masterKey;

    public AadhaarVaultService(
            AadhaarVaultRepository vaultRepository,
            @Value("${bharatpass.vault.master-key}") String masterKeyBase64) {
        this.vaultRepository = vaultRepository;
        // Derive a 256-bit key from the configured master key
        byte[] keyBytes = new byte[32];
        byte[] configuredKey = masterKeyBase64.getBytes(StandardCharsets.UTF_8);
        System.arraycopy(configuredKey, 0, keyBytes, 0, Math.min(configuredKey.length, 32));
        this.masterKey = new SecretKeySpec(keyBytes, "AES");
    }

    /**
     * Stores an Aadhaar number in the vault and returns a reference key.
     * The raw number is AES-256-GCM encrypted before persistence.
     */
    public UUID storeAadhaar(String rawAadhaarNumber) {
        try {
            byte[] encrypted = encrypt(rawAadhaarNumber);
            AadhaarVaultEntry entry = new AadhaarVaultEntry();
            entry.setEncryptedAadhaar(encrypted);
            entry.setEncryptionKeyId(KEY_ID);
            entry = vaultRepository.save(entry);
            return entry.getReferenceKey();
        } catch (Exception e) {
            throw new RuntimeException("Failed to store Aadhaar in vault", e);
        }
    }

    /**
     * Retrieves and decrypts an Aadhaar number by its reference key.
     * Used internally only — never expose raw numbers to frontend.
     */
    public String retrieveAadhaar(UUID referenceKey) {
        AadhaarVaultEntry entry = vaultRepository.findByReferenceKey(referenceKey)
                .orElseThrow(() -> new IllegalArgumentException("Invalid vault reference key"));
        try {
            return decrypt(entry.getEncryptedAadhaar());
        } catch (Exception e) {
            throw new RuntimeException("Failed to decrypt Aadhaar from vault", e);
        }
    }

    /**
     * Returns a masked Aadhaar representation (XXXXXXXX1234) for UI display.
     */
    public String getMaskedAadhaar(UUID referenceKey) {
        String raw = retrieveAadhaar(referenceKey);
        return MaskingUtil.maskAadhaar(raw);
    }

    private byte[] encrypt(String plaintext) throws Exception {
        Cipher cipher = Cipher.getInstance(ALGORITHM);
        byte[] iv = new byte[GCM_IV_LENGTH];
        new SecureRandom().nextBytes(iv);
        cipher.init(Cipher.ENCRYPT_MODE, masterKey, new GCMParameterSpec(GCM_TAG_LENGTH, iv));
        byte[] ciphertext = cipher.doFinal(plaintext.getBytes(StandardCharsets.UTF_8));

        // Prepend IV to ciphertext for storage
        byte[] combined = new byte[iv.length + ciphertext.length];
        System.arraycopy(iv, 0, combined, 0, iv.length);
        System.arraycopy(ciphertext, 0, combined, iv.length, ciphertext.length);
        return combined;
    }

    private String decrypt(byte[] encrypted) throws Exception {
        byte[] iv = new byte[GCM_IV_LENGTH];
        System.arraycopy(encrypted, 0, iv, 0, iv.length);
        byte[] ciphertext = new byte[encrypted.length - iv.length];
        System.arraycopy(encrypted, iv.length, ciphertext, 0, ciphertext.length);

        Cipher cipher = Cipher.getInstance(ALGORITHM);
        cipher.init(Cipher.DECRYPT_MODE, masterKey, new GCMParameterSpec(GCM_TAG_LENGTH, iv));
        byte[] plaintext = cipher.doFinal(ciphertext);
        return new String(plaintext, StandardCharsets.UTF_8);
    }
}
