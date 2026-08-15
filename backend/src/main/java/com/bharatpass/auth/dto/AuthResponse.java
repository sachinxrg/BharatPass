package com.bharatpass.auth.dto;

import java.util.UUID;

public class AuthResponse {

    private String accessToken;
    private String refreshToken;
    private UUID citizenId;
    private String name;
    private String maskedAadhaar;
    private boolean ekycVerified;
    private String role;

    // Builder-style setters for fluent construction
    public AuthResponse accessToken(String accessToken) { this.accessToken = accessToken; return this; }
    public AuthResponse refreshToken(String refreshToken) { this.refreshToken = refreshToken; return this; }
    public AuthResponse citizenId(UUID citizenId) { this.citizenId = citizenId; return this; }
    public AuthResponse name(String name) { this.name = name; return this; }
    public AuthResponse maskedAadhaar(String maskedAadhaar) { this.maskedAadhaar = maskedAadhaar; return this; }
    public AuthResponse ekycVerified(boolean ekycVerified) { this.ekycVerified = ekycVerified; return this; }
    public AuthResponse role(String role) { this.role = role; return this; }

    // Getters
    public String getAccessToken() { return accessToken; }
    public String getRefreshToken() { return refreshToken; }
    public UUID getCitizenId() { return citizenId; }
    public String getName() { return name; }
    public String getMaskedAadhaar() { return maskedAadhaar; }
    public boolean isEkycVerified() { return ekycVerified; }
    public String getRole() { return role; }
}
