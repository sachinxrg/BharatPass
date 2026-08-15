package com.bharatpass.auth.service;

import com.bharatpass.common.util.MaskingUtil;
import org.redisson.api.RBucket;
import org.redisson.api.RedissonClient;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Service;

import java.security.SecureRandom;
import java.time.Duration;
import java.util.UUID;

/**
 * Mock UIDAI e-KYC Engine — Simulates OTP generation and validation.
 * In production, this would integrate with the real UIDAI Auth API v2.5.
 */
@Service
public class AadhaarOtpService {

    private static final SecureRandom RANDOM = new SecureRandom();
    private final RedissonClient redissonClient;
    private final int otpExpiryMinutes;
    private final int maxAttemptsPerHour;

    public AadhaarOtpService(
            RedissonClient redissonClient,
            @Value("${bharatpass.aadhaar.otp-expiry-minutes:10}") int otpExpiryMinutes,
            @Value("${bharatpass.aadhaar.max-otp-attempts-per-hour:5}") int maxAttemptsPerHour) {
        this.redissonClient = redissonClient;
        this.otpExpiryMinutes = otpExpiryMinutes;
        this.maxAttemptsPerHour = maxAttemptsPerHour;
    }

    /**
     * Generates a 6-digit OTP for the given Aadhaar number.
     * Stores txnId → {otp, aadhaar} mapping in Redis with TTL.
     *
     * @return Transaction ID for verification
     * @throws RuntimeException if rate limit exceeded
     */
    public String generateOtp(String aadhaarNumber) {
        // Rate limiting check
        String rateLimitKey = "otp:ratelimit:" + aadhaarNumber;
        RBucket<Integer> rateBucket = redissonClient.getBucket(rateLimitKey);
        Integer attempts = rateBucket.get();
        if (attempts != null && attempts >= maxAttemptsPerHour) {
            throw new RuntimeException("Rate limit exceeded. Maximum " + maxAttemptsPerHour + " OTP requests per hour.");
        }

        // Increment rate limit counter
        if (attempts == null) {
            rateBucket.set(1, Duration.ofHours(1));
        } else {
            rateBucket.set(attempts + 1, Duration.ofHours(1));
        }

        // Generate OTP and transaction ID
        String otp = String.format("%06d", RANDOM.nextInt(999999));
        String txnId = UUID.randomUUID().toString();

        // Store in Redis with expiry
        String otpKey = "otp:txn:" + txnId;
        String otpValue = otp + ":" + aadhaarNumber;
        RBucket<String> otpBucket = redissonClient.getBucket(otpKey);
        otpBucket.set(otpValue, Duration.ofMinutes(otpExpiryMinutes));

        // In production: send OTP via SMS gateway to Aadhaar-linked mobile
        // For demo: log the OTP
        System.out.println("[MOCK UIDAI] OTP for " + MaskingUtil.maskAadhaar(aadhaarNumber) + ": " + otp);

        return txnId;
    }

    /**
     * Verifies the OTP against the stored transaction.
     *
     * @return The Aadhaar number associated with the verified OTP
     * @throws RuntimeException if OTP is invalid or expired
     */
    public String verifyOtp(String txnId, String otp) {
        String otpKey = "otp:txn:" + txnId;
        RBucket<String> otpBucket = redissonClient.getBucket(otpKey);
        String storedValue = otpBucket.get();

        if (storedValue == null) {
            throw new RuntimeException("OTP expired or invalid transaction");
        }

        String[] parts = storedValue.split(":");
        String storedOtp = parts[0];
        String aadhaarNumber = parts[1];

        if (!storedOtp.equals(otp)) {
            throw new RuntimeException("Invalid OTP");
        }

        // Consume the OTP (single use)
        otpBucket.delete();

        return aadhaarNumber;
    }
}
