package com.bharatpass.auth.service;

import com.nimbusds.jose.*;
import com.nimbusds.jose.crypto.*;
import com.nimbusds.jwt.*;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Service;

import javax.crypto.SecretKey;
import javax.crypto.spec.SecretKeySpec;
import java.nio.charset.StandardCharsets;
import java.time.Instant;
import java.util.Date;
import java.util.UUID;

/**
 * JWT Token Service using HMAC-SHA256 for signing.
 * In production, replace with RS256 using RSA key pairs.
 */
@Service
public class JwtTokenService {

    private final SecretKey signingKey;
    private final long accessTokenExpiry;
    private final long refreshTokenExpiry;
    private final String issuer;

    public JwtTokenService(
            @Value("${bharatpass.vault.master-key}") String secret,
            @Value("${bharatpass.jwt.access-token-expiry:900}") long accessTokenExpiry,
            @Value("${bharatpass.jwt.refresh-token-expiry:604800}") long refreshTokenExpiry,
            @Value("${bharatpass.jwt.issuer:bharat-pass}") String issuer) {
        byte[] keyBytes = new byte[32];
        byte[] secretBytes = secret.getBytes(StandardCharsets.UTF_8);
        System.arraycopy(secretBytes, 0, keyBytes, 0, Math.min(secretBytes.length, 32));
        this.signingKey = new SecretKeySpec(keyBytes, "HmacSHA256");
        this.accessTokenExpiry = accessTokenExpiry;
        this.refreshTokenExpiry = refreshTokenExpiry;
        this.issuer = issuer;
    }

    public String generateAccessToken(UUID citizenId, String role) {
        return generateToken(citizenId.toString(), role, accessTokenExpiry, "access");
    }

    public String generateRefreshToken(UUID citizenId, String role) {
        return generateToken(citizenId.toString(), role, refreshTokenExpiry, "refresh");
    }

    public JWTClaimsSet validateAccessToken(String token) throws Exception {
        return validateToken(token, "access");
    }

    public JWTClaimsSet validateRefreshToken(String token) throws Exception {
        return validateToken(token, "refresh");
    }

    private String generateToken(String subject, String role, long expirySeconds, String tokenType) {
        try {
            Instant now = Instant.now();
            JWTClaimsSet claims = new JWTClaimsSet.Builder()
                    .subject(subject)
                    .issuer(issuer)
                    .claim("role", role)
                    .claim("type", tokenType)
                    .jwtID(UUID.randomUUID().toString())
                    .issueTime(Date.from(now))
                    .expirationTime(Date.from(now.plusSeconds(expirySeconds)))
                    .build();

            JWSHeader header = new JWSHeader.Builder(JWSAlgorithm.HS256)
                    .type(JOSEObjectType.JWT)
                    .build();

            SignedJWT signedJWT = new SignedJWT(header, claims);
            signedJWT.sign(new MACSigner(signingKey));
            return signedJWT.serialize();
        } catch (Exception e) {
            throw new RuntimeException("Failed to generate JWT token", e);
        }
    }

    private JWTClaimsSet validateToken(String token, String expectedType) throws Exception {
        SignedJWT signedJWT = SignedJWT.parse(token);
        if (!signedJWT.verify(new MACVerifier(signingKey))) {
            throw new JOSEException("Invalid JWT signature");
        }

        JWTClaimsSet claims = signedJWT.getJWTClaimsSet();

        // Check expiration
        if (claims.getExpirationTime().before(new Date())) {
            throw new JOSEException("JWT token has expired");
        }

        // Check token type
        String type = claims.getStringClaim("type");
        if (!expectedType.equals(type)) {
            throw new JOSEException("Invalid token type: expected " + expectedType + ", got " + type);
        }

        return claims;
    }
}
