package com.bharatpass.auth.entity;

import com.bharatpass.common.enums.Gender;
import jakarta.persistence.*;
import org.hibernate.annotations.JdbcTypeCode;
import org.hibernate.type.SqlTypes;

import java.time.Instant;
import java.time.LocalDate;
import java.util.Map;
import java.util.UUID;

@Entity
@Table(name = "citizens")
public class Citizen {

    @Id
    @GeneratedValue(strategy = GenerationType.UUID)
    @Column(name = "citizen_id")
    private UUID citizenId;

    @Column(name = "vault_ref_key")
    private UUID vaultRefKey;

    @Column(name = "full_name", nullable = false, length = 200)
    private String fullName;

    @Column(name = "date_of_birth", nullable = false)
    private LocalDate dateOfBirth;

    @Enumerated(EnumType.STRING)
    @Column(name = "gender", nullable = false, columnDefinition = "gender_type")
    private Gender gender;

    @Column(name = "mobile_hash", length = 64)
    private String mobileHash;

    @Column(name = "email", length = 255)
    private String email;

    @JdbcTypeCode(SqlTypes.JSON)
    @Column(name = "address_json", columnDefinition = "jsonb")
    private Map<String, Object> addressJson;

    @Column(name = "photo_url", length = 500)
    private String photoUrl;

    @Column(name = "ekyc_verified", nullable = false)
    private boolean ekycVerified = false;

    @Column(name = "digilocker_linked", nullable = false)
    private boolean digilockerLinked = false;

    @Column(name = "role", nullable = false, columnDefinition = "user_role")
    private String role = "ROLE_CITIZEN";

    @Column(name = "created_at", nullable = false)
    private Instant createdAt;

    @Column(name = "updated_at", nullable = false)
    private Instant updatedAt;

    @PrePersist
    protected void onCreate() {
        Instant now = Instant.now();
        if (createdAt == null) createdAt = now;
        if (updatedAt == null) updatedAt = now;
    }

    @PreUpdate
    protected void onUpdate() {
        updatedAt = Instant.now();
    }

    // Getters and Setters
    public UUID getCitizenId() { return citizenId; }
    public void setCitizenId(UUID citizenId) { this.citizenId = citizenId; }
    public UUID getVaultRefKey() { return vaultRefKey; }
    public void setVaultRefKey(UUID vaultRefKey) { this.vaultRefKey = vaultRefKey; }
    public String getFullName() { return fullName; }
    public void setFullName(String fullName) { this.fullName = fullName; }
    public LocalDate getDateOfBirth() { return dateOfBirth; }
    public void setDateOfBirth(LocalDate dateOfBirth) { this.dateOfBirth = dateOfBirth; }
    public Gender getGender() { return gender; }
    public void setGender(Gender gender) { this.gender = gender; }
    public String getMobileHash() { return mobileHash; }
    public void setMobileHash(String mobileHash) { this.mobileHash = mobileHash; }
    public String getEmail() { return email; }
    public void setEmail(String email) { this.email = email; }
    public Map<String, Object> getAddressJson() { return addressJson; }
    public void setAddressJson(Map<String, Object> addressJson) { this.addressJson = addressJson; }
    public String getPhotoUrl() { return photoUrl; }
    public void setPhotoUrl(String photoUrl) { this.photoUrl = photoUrl; }
    public boolean isEkycVerified() { return ekycVerified; }
    public void setEkycVerified(boolean ekycVerified) { this.ekycVerified = ekycVerified; }
    public boolean isDigilockerLinked() { return digilockerLinked; }
    public void setDigilockerLinked(boolean digilockerLinked) { this.digilockerLinked = digilockerLinked; }
    public String getRole() { return role; }
    public void setRole(String role) { this.role = role; }
    public Instant getCreatedAt() { return createdAt; }
    public Instant getUpdatedAt() { return updatedAt; }
}
