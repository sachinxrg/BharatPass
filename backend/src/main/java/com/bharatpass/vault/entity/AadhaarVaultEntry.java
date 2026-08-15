package com.bharatpass.vault.entity;

import jakarta.persistence.*;
import java.time.Instant;
import java.util.UUID;

@Entity
@Table(name = "aadhaar_vault")
public class AadhaarVaultEntry {

    @Id
    @GeneratedValue(strategy = GenerationType.UUID)
    @Column(name = "vault_id")
    private UUID vaultId;

    @Column(name = "encrypted_aadhaar", nullable = false)
    private byte[] encryptedAadhaar;

    @Column(name = "reference_key", nullable = false, unique = true)
    private UUID referenceKey;

    @Column(name = "encryption_key_id", nullable = false)
    private String encryptionKeyId;

    @Column(name = "created_at", nullable = false)
    private Instant createdAt;

    @Column(name = "rotated_at")
    private Instant rotatedAt;

    @PrePersist
    protected void onCreate() {
        if (createdAt == null) createdAt = Instant.now();
        if (referenceKey == null) referenceKey = UUID.randomUUID();
    }

    // Getters and setters
    public UUID getVaultId() { return vaultId; }
    public void setVaultId(UUID vaultId) { this.vaultId = vaultId; }
    public byte[] getEncryptedAadhaar() { return encryptedAadhaar; }
    public void setEncryptedAadhaar(byte[] encryptedAadhaar) { this.encryptedAadhaar = encryptedAadhaar; }
    public UUID getReferenceKey() { return referenceKey; }
    public void setReferenceKey(UUID referenceKey) { this.referenceKey = referenceKey; }
    public String getEncryptionKeyId() { return encryptionKeyId; }
    public void setEncryptionKeyId(String encryptionKeyId) { this.encryptionKeyId = encryptionKeyId; }
    public Instant getCreatedAt() { return createdAt; }
    public void setCreatedAt(Instant createdAt) { this.createdAt = createdAt; }
    public Instant getRotatedAt() { return rotatedAt; }
    public void setRotatedAt(Instant rotatedAt) { this.rotatedAt = rotatedAt; }
}
