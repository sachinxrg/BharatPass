package com.bharatpass.application.service;

import com.bharatpass.application.entity.ApplicationTimeline;
import com.bharatpass.application.entity.PassportApplication;
import com.bharatpass.application.repository.ApplicationRepository;
import com.bharatpass.application.repository.TimelineRepository;
import com.bharatpass.common.enums.ApplicationCategory;
import com.bharatpass.common.enums.ApplicationStage;
import com.bharatpass.common.enums.ApplicationType;
import com.bharatpass.events.service.EventPublisherService;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.math.BigDecimal;
import java.time.Instant;
import java.time.temporal.ChronoUnit;
import java.util.List;
import java.util.Map;
import java.util.UUID;
import java.util.concurrent.ThreadLocalRandom;

@Service
public class ApplicationService {

    private final ApplicationRepository applicationRepository;
    private final TimelineRepository timelineRepository;
    private final EventPublisherService eventPublisher;

    public ApplicationService(ApplicationRepository applicationRepository,
                              TimelineRepository timelineRepository,
                              EventPublisherService eventPublisher) {
        this.applicationRepository = applicationRepository;
        this.timelineRepository = timelineRepository;
        this.eventPublisher = eventPublisher;
    }

    @Transactional
    public PassportApplication createApplication(UUID citizenId, ApplicationType type,
                                                  ApplicationCategory category,
                                                  Map<String, Object> formData) {
        PassportApplication app = new PassportApplication();
        app.setCitizenId(citizenId);
        app.setApplicationType(type);
        app.setCategory(category);
        app.setFormData(formData);
        app.setTatkaal(category == ApplicationCategory.TATKAAL || category == ApplicationCategory.SUPER_TATKAAL);
        app.setFeeAmount(calculateFee(type, category));
        app.setFileNumber(generateFileNumber(type));
        app.setCurrentStage(ApplicationStage.INITIATED);

        // SLA: 30 days for Normal, 7 days for Tatkaal, 3 days for Super Tatkaal
        int slaDays = switch (category) {
            case TATKAAL -> 7;
            case SUPER_TATKAAL -> 3;
            default -> 30;
        };
        app.setSlaDeadline(Instant.now().plus(slaDays, ChronoUnit.DAYS));

        PassportApplication saved = applicationRepository.save(app);

        // Record timeline event
        recordTimeline(saved.getAppId(), ApplicationStage.INITIATED, "Application created", citizenId, "ROLE_CITIZEN");

        return saved;
    }

    public PassportApplication getApplication(UUID appId) {
        return applicationRepository.findById(appId)
                .orElseThrow(() -> new IllegalArgumentException("Application not found: " + appId));
    }

    public List<PassportApplication> getCitizenApplications(UUID citizenId) {
        return applicationRepository.findByCitizenIdOrderByCreatedAtDesc(citizenId);
    }

    public List<ApplicationTimeline> getTimeline(UUID appId) {
        return timelineRepository.findByAppIdOrderByCreatedAtAsc(appId);
    }

    @Transactional
    public PassportApplication advanceStage(UUID appId, ApplicationStage newStage,
                                             UUID actorId, String actorRole,
                                             Map<String, Object> metadata) {
        PassportApplication app = getApplication(appId);
        ApplicationStage oldStage = app.getCurrentStage();
        app.setCurrentStage(newStage);

        if (newStage == ApplicationStage.FORM_SUBMITTED) {
            app.setSubmittedAt(Instant.now());
        }

        PassportApplication saved = applicationRepository.save(app);
        recordTimeline(appId, newStage, "Stage changed from " + oldStage + " to " + newStage,
                       actorId, actorRole);

        // Publish SSE event
        eventPublisher.publishStageChange(appId, oldStage.name(), newStage.name());

        return saved;
    }

    public Page<PassportApplication> getApplicationsByStage(ApplicationStage stage, Pageable pageable) {
        return applicationRepository.findByCurrentStage(stage, pageable);
    }

    private void recordTimeline(UUID appId, ApplicationStage stage, String status,
                                UUID actorId, String actorRole) {
        ApplicationTimeline event = new ApplicationTimeline();
        event.setAppId(appId);
        event.setStage(stage);
        event.setStatus(status);
        event.setActorId(actorId);
        event.setActorRole(actorRole);
        timelineRepository.save(event);
    }

    private BigDecimal calculateFee(ApplicationType type, ApplicationCategory category) {
        BigDecimal baseFee = switch (type) {
            case FRESH -> new BigDecimal("1500");
            case RENEWAL -> new BigDecimal("1500");
            case REISSUE -> new BigDecimal("3000");
            case DIPLOMATIC -> new BigDecimal("0");
            case OFFICIAL -> new BigDecimal("0");
        };

        if (category == ApplicationCategory.TATKAAL) {
            baseFee = baseFee.add(new BigDecimal("2000"));
        } else if (category == ApplicationCategory.SUPER_TATKAAL) {
            baseFee = baseFee.add(new BigDecimal("3500"));
        }

        return baseFee;
    }

    private String generateFileNumber(ApplicationType type) {
        String prefix = "BP";
        int year = java.time.Year.now().getValue();
        int random = ThreadLocalRandom.current().nextInt(100000, 999999);
        return prefix + "-" + year + "-" + random;
    }
}
