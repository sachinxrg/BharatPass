package com.bharatpass.police.service;

import com.bharatpass.common.enums.ApplicationStage;
import com.bharatpass.common.enums.VerificationVerdict;
import com.bharatpass.application.service.ApplicationService;
import com.bharatpass.events.service.EventPublisherService;
import com.bharatpass.police.entity.PoliceVerification;
import com.bharatpass.police.repository.PoliceVerificationRepository;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.math.BigDecimal;
import java.time.Instant;
import java.util.List;
import java.util.Map;
import java.util.UUID;

@Service
public class PoliceVerificationService {

    private final PoliceVerificationRepository pvRepository;
    private final ApplicationService applicationService;
    private final EventPublisherService eventPublisher;

    public PoliceVerificationService(PoliceVerificationRepository pvRepository,
                                      ApplicationService applicationService,
                                      EventPublisherService eventPublisher) {
        this.pvRepository = pvRepository;
        this.applicationService = applicationService;
        this.eventPublisher = eventPublisher;
    }

    public List<PoliceVerification> getPendingAssignments(UUID officerId) {
        return pvRepository.findByOfficerIdAndVerdictIsNullOrderByDispatchDateDesc(officerId);
    }

    @Transactional
    public PoliceVerification submitReport(UUID pvId, BigDecimal gpsLat, BigDecimal gpsLng,
                                            Map<String, Object> checklist,
                                            VerificationVerdict verdict,
                                            String signature, String remarks) {
        PoliceVerification pv = pvRepository.findById(pvId)
                .orElseThrow(() -> new IllegalArgumentException("Verification not found: " + pvId));

        pv.setGpsLatitude(gpsLat);
        pv.setGpsLongitude(gpsLng);
        pv.setChecklistJson(checklist);
        pv.setVerdict(verdict);
        pv.setDigitalSignature(signature);
        pv.setRemarks(remarks);
        pv.setVisitDate(Instant.now());
        pv.setSubmittedAt(Instant.now());

        PoliceVerification saved = pvRepository.save(pv);

        // Advance application stage if verdict is CLEAR
        if (verdict == VerificationVerdict.CLEAR) {
            applicationService.advanceStage(pv.getAppId(), ApplicationStage.POLICE_VERIFIED,
                    null, "ROLE_POLICE_OFFICER", Map.of("pvId", pvId.toString(), "verdict", "CLEAR"));
        }

        // Publish SSE event
        eventPublisher.publishPvUpdate(pv.getAppId(), verdict.name());

        return saved;
    }

    @Transactional
    public PoliceVerification dispatchVerification(UUID appId, UUID officerId) {
        PoliceVerification pv = new PoliceVerification();
        pv.setAppId(appId);
        pv.setOfficerId(officerId);
        PoliceVerification saved = pvRepository.save(pv);

        applicationService.advanceStage(appId, ApplicationStage.PVS_DISPATCHED,
                null, "ROLE_RPO_ADMIN", Map.of("officerId", officerId.toString()));

        return saved;
    }
}
