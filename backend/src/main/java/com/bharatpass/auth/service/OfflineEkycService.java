package com.bharatpass.auth.service;

import com.bharatpass.auth.entity.Citizen;
import com.bharatpass.auth.repository.CitizenRepository;
import com.bharatpass.common.enums.Gender;
import com.bharatpass.common.exception.EkycValidationException;
import com.bharatpass.vault.service.AadhaarVaultService;
import org.springframework.stereotype.Service;

import java.time.LocalDate;
import java.util.*;

/**
 * Offline e-KYC Service — Processes Aadhaar Paperless Offline e-KYC.
 * Accepts .zip files with 4-digit share codes, decrypts XML payloads,
 * verifies digital signatures, and extracts demographic data.
 *
 * This is a MOCK implementation for demonstration.
 * Production would use Bouncy Castle for XML-DSig verification.
 */
@Service
public class OfflineEkycService {

    private final AadhaarVaultService vaultService;
    private final CitizenRepository citizenRepository;

    public OfflineEkycService(AadhaarVaultService vaultService, CitizenRepository citizenRepository) {
        this.vaultService = vaultService;
        this.citizenRepository = citizenRepository;
    }

    /**
     * Processes an offline e-KYC ZIP file and creates/updates a Citizen record.
     * In production, this would:
     * 1. Unzip the file using the share code as password
     * 2. Parse the XML payload
     * 3. Verify the UIDAI digital signature using Bouncy Castle
     * 4. Extract demographic data
     *
     * @param zipFileBytes The raw ZIP file bytes
     * @param shareCode The 4-digit share code
     * @return The created/updated Citizen entity
     */
    public Citizen processOfflineEkyc(byte[] zipFileBytes, String shareCode) {
        // Validate inputs
        if (zipFileBytes == null || zipFileBytes.length == 0) {
            throw new EkycValidationException("Empty e-KYC ZIP file");
        }
        if (shareCode == null || !shareCode.matches("\\d{4}")) {
            throw new EkycValidationException("Share code must be exactly 4 digits");
        }

        // MOCK: Simulate XML extraction and digital signature verification
        // In production, use ZipInputStream + Bouncy Castle XML-DSig
        Map<String, Object> ekycData = simulateEkycExtraction(zipFileBytes, shareCode);

        // Store Aadhaar in encrypted vault
        String aadhaarNumber = (String) ekycData.get("aadhaarNumber");
        UUID vaultRefKey = vaultService.storeAadhaar(aadhaarNumber);

        // Check if citizen already exists
        Optional<Citizen> existingCitizen = citizenRepository.findByVaultRefKey(vaultRefKey);
        Citizen citizen = existingCitizen.orElseGet(Citizen::new);

        // Populate from e-KYC data
        citizen.setVaultRefKey(vaultRefKey);
        citizen.setFullName((String) ekycData.get("name"));
        citizen.setDateOfBirth(LocalDate.parse((String) ekycData.get("dob")));
        citizen.setGender(Gender.valueOf((String) ekycData.get("gender")));
        citizen.setEkycVerified(true);

        @SuppressWarnings("unchecked")
        Map<String, Object> address = (Map<String, Object>) ekycData.get("address");
        citizen.setAddressJson(address);

        citizen.setPhotoUrl((String) ekycData.get("photo"));

        return citizenRepository.save(citizen);
    }

    /**
     * Mock e-KYC data extraction — returns simulated demographic data.
     * Production would decrypt and parse actual UIDAI XML.
     */
    private Map<String, Object> simulateEkycExtraction(byte[] zipFileBytes, String shareCode) {
        Map<String, Object> data = new HashMap<>();
        data.put("aadhaarNumber", "999988887777");
        data.put("name", "Rajesh Kumar Sharma");
        data.put("dob", "1990-05-15");
        data.put("gender", "M");

        Map<String, Object> address = new HashMap<>();
        address.put("house", "42");
        address.put("street", "MG Road");
        address.put("landmark", "Near City Mall");
        address.put("locality", "Koramangala");
        address.put("district", "Bengaluru Urban");
        address.put("state", "Karnataka");
        address.put("pincode", "560034");
        data.put("address", address);

        data.put("photo", "/mock/photo/ekyc_photo.jpg");

        return data;
    }
}
