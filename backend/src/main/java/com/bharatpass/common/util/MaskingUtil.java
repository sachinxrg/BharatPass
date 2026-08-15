package com.bharatpass.common.util;

/**
 * Utility for masking sensitive data in UI outputs.
 * Complies with UIDAI Data Vault mandates.
 */
public final class MaskingUtil {

    private MaskingUtil() {}

    /**
     * Masks an Aadhaar number to show only last 4 digits.
     * Input: "123456789012" → Output: "XXXXXXXX9012"
     */
    public static String maskAadhaar(String aadhaarNumber) {
        if (aadhaarNumber == null || aadhaarNumber.length() < 4) {
            return "XXXXXXXXXXXX";
        }
        return "XXXXXXXX" + aadhaarNumber.substring(aadhaarNumber.length() - 4);
    }

    /**
     * Masks a mobile number to show only last 4 digits.
     * Input: "9876543210" → Output: "XXXXXX3210"
     */
    public static String maskMobile(String mobile) {
        if (mobile == null || mobile.length() < 4) {
            return "XXXXXXXXXX";
        }
        return "XXXXXX" + mobile.substring(mobile.length() - 4);
    }

    /**
     * Masks an email address.
     * Input: "user@example.com" → Output: "u***@example.com"
     */
    public static String maskEmail(String email) {
        if (email == null || !email.contains("@")) {
            return "***@***.com";
        }
        int atIndex = email.indexOf('@');
        if (atIndex <= 1) {
            return email.charAt(0) + "***" + email.substring(atIndex);
        }
        return email.charAt(0) + "***" + email.substring(atIndex);
    }
}
