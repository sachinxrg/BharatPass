package com.bharatpass.police.controller;

import com.bharatpass.common.enums.VerificationVerdict;
import com.bharatpass.police.entity.PoliceVerification;
import com.bharatpass.police.service.PoliceVerificationService;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.math.BigDecimal;
import java.util.List;
import java.util.Map;
import java.util.UUID;

@RestController
@RequestMapping("/api/v1/police")
public class PoliceVerificationController {

    private final PoliceVerificationService pvService;

    public PoliceVerificationController(PoliceVerificationService pvService) {
        this.pvService = pvService;
    }

    @GetMapping("/assignments")
    public ResponseEntity<List<PoliceVerification>> getAssignments(@RequestParam UUID officerId) {
        return ResponseEntity.ok(pvService.getPendingAssignments(officerId));
    }

    @PostMapping("/reports")
    @SuppressWarnings("unchecked")
    public ResponseEntity<?> submitReport(@RequestBody Map<String, Object> body) {
        UUID pvId = UUID.fromString((String) body.get("pvId"));
        BigDecimal gpsLat = new BigDecimal(body.get("gpsLat").toString());
        BigDecimal gpsLng = new BigDecimal(body.get("gpsLng").toString());
        Map<String, Object> checklist = (Map<String, Object>) body.get("checklist");
        VerificationVerdict verdict = VerificationVerdict.valueOf((String) body.get("verdict"));
        String signature = (String) body.get("signature");
        String remarks = (String) body.getOrDefault("remarks", "");

        PoliceVerification pv = pvService.submitReport(pvId, gpsLat, gpsLng, checklist, verdict, signature, remarks);

        return ResponseEntity.status(HttpStatus.CREATED).body(Map.of(
                "reportId", pv.getPvId(),
                "status", "SUBMITTED"
        ));
    }
}
