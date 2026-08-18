package com.bharatpass.common.util;

import org.junit.jupiter.api.DisplayName;
import org.junit.jupiter.api.Test;

import static org.junit.jupiter.api.Assertions.assertEquals;

@DisplayName("MaskingUtil Unit Tests")
class MaskingUtilTest {

    @Test
    @DisplayName("Should mask Aadhaar number preserving last 4 digits")
    void testMaskAadhaar() {
        assertEquals("XXXXXXXX9012", MaskingUtil.maskAadhaar("123456789012"));
        assertEquals("XXXXXXXXXXXX", MaskingUtil.maskAadhaar(null));
        assertEquals("XXXXXXXXXXXX", MaskingUtil.maskAadhaar("12"));
    }

    @Test
    @DisplayName("Should mask mobile number preserving last 4 digits")
    void testMaskMobile() {
        assertEquals("XXXXXX3210", MaskingUtil.maskMobile("9876543210"));
        assertEquals("XXXXXXXXXX", MaskingUtil.maskMobile(null));
        assertEquals("XXXXXXXXXX", MaskingUtil.maskMobile("123"));
    }

    @Test
    @DisplayName("Should mask email address")
    void testMaskEmail() {
        assertEquals("u***@example.com", MaskingUtil.maskEmail("user@example.com"));
        assertEquals("***@***.com", MaskingUtil.maskEmail(null));
        assertEquals("***@***.com", MaskingUtil.maskEmail("invalid-email"));
    }
}
