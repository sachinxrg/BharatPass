package com.bharatpass.application.controller;

import com.bharatpass.application.entity.ApplicationTimeline;
import com.bharatpass.application.entity.PassportApplication;
import com.bharatpass.application.service.ApplicationService;
import com.bharatpass.common.enums.ApplicationCategory;
import com.bharatpass.common.enums.ApplicationStage;
import com.bharatpass.common.enums.ApplicationType;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Map;
import java.util.UUID;

@RestController
@RequestMapping("/api/v1/applications")
public class ApplicationController {

    private final ApplicationService applicationService;

    public ApplicationController(ApplicationService applicationService) {
        this.applicationService = applicationService;
    }

    @PostMapping
    public ResponseEntity<?> createApplication(@RequestBody Map<String, Object> body,
                                                Authentication auth) {
        UUID citizenId = UUID.fromString(auth.getName());
        ApplicationType type = ApplicationType.valueOf((String) body.get("applicationType"));
        ApplicationCategory category = ApplicationCategory.valueOf(
                body.getOrDefault("category", "NORMAL").toString());

        @SuppressWarnings("unchecked")
        Map<String, Object> formData = (Map<String, Object>) body.get("formData");

        PassportApplication app = applicationService.createApplication(citizenId, type, category, formData);

        return ResponseEntity.status(HttpStatus.CREATED).body(Map.of(
                "appId", app.getAppId(),
                "fileNumber", app.getFileNumber(),
                "status", app.getCurrentStage().name(),
                "feeAmount", app.getFeeAmount(),
                "slaDeadline", app.getSlaDeadline().toString()
        ));
    }

    @GetMapping("/{appId}")
    public ResponseEntity<PassportApplication> getApplication(@PathVariable UUID appId) {
        return ResponseEntity.ok(applicationService.getApplication(appId));
    }

    @GetMapping("/{appId}/timeline")
    public ResponseEntity<List<ApplicationTimeline>> getTimeline(@PathVariable UUID appId) {
        return ResponseEntity.ok(applicationService.getTimeline(appId));
    }

    @PatchMapping("/{appId}/stage")
    public ResponseEntity<PassportApplication> advanceStage(
            @PathVariable UUID appId,
            @RequestBody Map<String, Object> body,
            Authentication auth) {
        ApplicationStage stage = ApplicationStage.valueOf((String) body.get("stage"));
        UUID actorId = UUID.fromString(auth.getName());
        String role = auth.getAuthorities().iterator().next().getAuthority();

        @SuppressWarnings("unchecked")
        Map<String, Object> metadata = (Map<String, Object>) body.get("metadata");

        return ResponseEntity.ok(applicationService.advanceStage(appId, stage, actorId, role, metadata));
    }

    @GetMapping
    public ResponseEntity<?> getMyApplications(Authentication auth) {
        UUID citizenId = UUID.fromString(auth.getName());
        return ResponseEntity.ok(applicationService.getCitizenApplications(citizenId));
    }
}
