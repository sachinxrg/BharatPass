package com.bharatpass.admin.controller;

import com.bharatpass.application.repository.ApplicationRepository;
import com.bharatpass.common.enums.ApplicationStage;
import org.springframework.data.domain.PageRequest;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

import java.util.HashMap;
import java.util.Map;

@RestController
@RequestMapping("/api/v1/admin")
@PreAuthorize("hasAnyRole('RPO_ADMIN', 'SUPER_ADMIN')")
public class AdminDashboardController {

    private final ApplicationRepository applicationRepository;

    public AdminDashboardController(ApplicationRepository applicationRepository) {
        this.applicationRepository = applicationRepository;
    }

    @GetMapping("/dashboard/stats")
    public ResponseEntity<?> getDashboardStats(@RequestParam(required = false) String rpoCode) {
        Map<String, Object> stats = new HashMap<>();
        stats.put("totalApplications", applicationRepository.count());
        stats.put("initiated", applicationRepository.countByCurrentStage(ApplicationStage.INITIATED));
        stats.put("ekycVerified", applicationRepository.countByCurrentStage(ApplicationStage.EKYC_VERIFIED));
        stats.put("appointmentBooked", applicationRepository.countByCurrentStage(ApplicationStage.APPOINTMENT_BOOKED));
        stats.put("pvsDispatched", applicationRepository.countByCurrentStage(ApplicationStage.PVS_DISPATCHED));
        stats.put("policeVerified", applicationRepository.countByCurrentStage(ApplicationStage.POLICE_VERIFIED));
        stats.put("printingQueued", applicationRepository.countByCurrentStage(ApplicationStage.PRINTING_QUEUED));
        stats.put("delivered", applicationRepository.countByCurrentStage(ApplicationStage.DELIVERED));
        stats.put("rejected", applicationRepository.countByCurrentStage(ApplicationStage.REJECTED));
        return ResponseEntity.ok(stats);
    }

    @GetMapping("/applications")
    public ResponseEntity<?> getApplications(
            @RequestParam(required = false) String status,
            @RequestParam(defaultValue = "0") int page,
            @RequestParam(defaultValue = "20") int size) {
        if (status != null) {
            ApplicationStage stage = ApplicationStage.valueOf(status);
            return ResponseEntity.ok(applicationRepository.findByCurrentStage(stage, PageRequest.of(page, size)));
        }
        return ResponseEntity.ok(applicationRepository.findAll(PageRequest.of(page, size)));
    }
}
