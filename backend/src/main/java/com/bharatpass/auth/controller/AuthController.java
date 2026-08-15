package com.bharatpass.auth.controller;

import com.bharatpass.auth.dto.AuthResponse;
import com.bharatpass.auth.dto.OtpRequest;
import com.bharatpass.auth.dto.OtpVerifyRequest;
import com.bharatpass.auth.entity.Citizen;
import com.bharatpass.auth.repository.CitizenRepository;
import com.bharatpass.auth.service.AadhaarOtpService;
import com.bharatpass.auth.service.JwtTokenService;
import com.bharatpass.auth.service.OfflineEkycService;
import com.bharatpass.common.enums.Gender;
import com.bharatpass.common.util.MaskingUtil;
import com.bharatpass.vault.service.AadhaarVaultService;
import jakarta.validation.Valid;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;

import java.time.LocalDate;
import java.util.Map;
import java.util.UUID;

@RestController
@RequestMapping("/api/v1/auth")
public class AuthController {

    private final AadhaarOtpService otpService;
    private final OfflineEkycService ekycService;
    private final JwtTokenService jwtTokenService;
    private final AadhaarVaultService vaultService;
    private final CitizenRepository citizenRepository;

    public AuthController(AadhaarOtpService otpService,
                          OfflineEkycService ekycService,
                          JwtTokenService jwtTokenService,
                          AadhaarVaultService vaultService,
                          CitizenRepository citizenRepository) {
        this.otpService = otpService;
        this.ekycService = ekycService;
        this.jwtTokenService = jwtTokenService;
        this.vaultService = vaultService;
        this.citizenRepository = citizenRepository;
    }

    /**
     * Generate OTP for Aadhaar-based authentication.
     * POST /api/v1/auth/aadhaar/otp/generate
     */
    @PostMapping("/aadhaar/otp/generate")
    public ResponseEntity<?> generateOtp(@Valid @RequestBody OtpRequest request) {
        String txnId = otpService.generateOtp(request.getAadhaarNumber());
        return ResponseEntity.ok(Map.of(
                "txnId", txnId,
                "message", "OTP sent to Aadhaar-linked mobile number"
        ));
    }

    /**
     * Verify OTP and issue JWT tokens.
     * POST /api/v1/auth/aadhaar/otp/verify
     */
    @PostMapping("/aadhaar/otp/verify")
    public ResponseEntity<?> verifyOtp(@Valid @RequestBody OtpVerifyRequest request) {
        String aadhaarNumber = otpService.verifyOtp(request.getTxnId(), request.getOtp());

        // Store Aadhaar in vault and find/create citizen
        UUID vaultRefKey = vaultService.storeAadhaar(aadhaarNumber);
        Citizen citizen = citizenRepository.findByVaultRefKey(vaultRefKey)
                .orElseGet(() -> {
                    Citizen newCitizen = new Citizen();
                    newCitizen.setVaultRefKey(vaultRefKey);
                    newCitizen.setFullName("Citizen-" + aadhaarNumber.substring(8));
                    newCitizen.setDateOfBirth(LocalDate.of(1990, 1, 1));
                    newCitizen.setGender(Gender.M);
                    return citizenRepository.save(newCitizen);
                });

        String accessToken = jwtTokenService.generateAccessToken(citizen.getCitizenId(), citizen.getRole());
        String refreshToken = jwtTokenService.generateRefreshToken(citizen.getCitizenId(), citizen.getRole());

        AuthResponse response = new AuthResponse()
                .accessToken(accessToken)
                .refreshToken(refreshToken)
                .citizenId(citizen.getCitizenId())
                .name(citizen.getFullName())
                .maskedAadhaar(MaskingUtil.maskAadhaar(aadhaarNumber))
                .ekycVerified(citizen.isEkycVerified())
                .role(citizen.getRole());

        return ResponseEntity.ok(response);
    }

    /**
     * Process Aadhaar Paperless Offline e-KYC.
     * POST /api/v1/auth/ekyc/offline (multipart)
     */
    @PostMapping("/ekyc/offline")
    public ResponseEntity<?> processOfflineEkyc(
            @RequestParam("file") MultipartFile file,
            @RequestParam("shareCode") String shareCode) throws Exception {
        byte[] zipBytes = file.getBytes();
        Citizen citizen = ekycService.processOfflineEkyc(zipBytes, shareCode);

        String accessToken = jwtTokenService.generateAccessToken(citizen.getCitizenId(), citizen.getRole());
        String refreshToken = jwtTokenService.generateRefreshToken(citizen.getCitizenId(), citizen.getRole());

        String maskedAadhaar = vaultService.getMaskedAadhaar(citizen.getVaultRefKey());

        AuthResponse response = new AuthResponse()
                .accessToken(accessToken)
                .refreshToken(refreshToken)
                .citizenId(citizen.getCitizenId())
                .name(citizen.getFullName())
                .maskedAadhaar(maskedAadhaar)
                .ekycVerified(citizen.isEkycVerified())
                .role(citizen.getRole());

        return ResponseEntity.ok(response);
    }

    /**
     * Refresh access token.
     * POST /api/v1/auth/token/refresh
     */
    @PostMapping("/token/refresh")
    public ResponseEntity<?> refreshToken(@RequestBody Map<String, String> body) {
        try {
            String refreshToken = body.get("refreshToken");
            var claims = jwtTokenService.validateRefreshToken(refreshToken);
            String userId = claims.getSubject();
            String role = claims.getStringClaim("role");

            String newAccessToken = jwtTokenService.generateAccessToken(UUID.fromString(userId), role);
            return ResponseEntity.ok(Map.of("accessToken", newAccessToken));
        } catch (Exception e) {
            return ResponseEntity.status(401).body(Map.of("error", "Invalid refresh token"));
        }
    }
}
