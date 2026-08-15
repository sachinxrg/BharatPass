package com.bharatpass.application.entity;

import com.bharatpass.common.enums.ApplicationCategory;
import com.bharatpass.common.enums.ApplicationStage;
import com.bharatpass.common.enums.ApplicationType;
import jakarta.persistence.*;
import org.hibernate.annotations.JdbcTypeCode;
import org.hibernate.type.SqlTypes;

import java.math.BigDecimal;
import java.time.Instant;
import java.util.Map;
import java.util.UUID;

@Entity
@Table(name = "passport_applications")
public class PassportApplication {

    @Id
    @GeneratedValue(strategy = GenerationType.UUID)
    @Column(name = "app_id")
    private UUID appId;

    @Column(name = "citizen_id", nullable = false)
    private UUID citizenId;

    @Enumerated(EnumType.STRING)
    @Column(name = "application_type", nullable = false, columnDefinition = "application_type")
    private ApplicationType applicationType;

    @Enumerated(EnumType.STRING)
    @Column(name = "category", nullable = false, columnDefinition = "application_category")
    private ApplicationCategory category = ApplicationCategory.NORMAL;

    @Enumerated(EnumType.STRING)
    @Column(name = "current_stage", nullable = false, columnDefinition = "application_stage")
    private ApplicationStage currentStage = ApplicationStage.INITIATED;

    @JdbcTypeCode(SqlTypes.JSON)
    @Column(name = "form_data", columnDefinition = "jsonb")
    private Map<String, Object> formData;

    @Column(name = "file_number", unique = true, length = 30)
    private String fileNumber;

    @Column(name = "fee_amount", precision = 10, scale = 2)
    private BigDecimal feeAmount;

    @Column(name = "fee_paid", nullable = false)
    private boolean feePaid = false;

    @Column(name = "tatkaal", nullable = false)
    private boolean tatkaal = false;

    @Column(name = "submitted_at")
    private Instant submittedAt;

    @Column(name = "sla_deadline")
    private Instant slaDeadline;

    @Column(name = "created_at", nullable = false)
    private Instant createdAt;

    @Column(name = "updated_at", nullable = false)
    private Instant updatedAt;

    @PrePersist
    protected void onCreate() {
        Instant now = Instant.now();
        if (createdAt == null) createdAt = now;
        if (updatedAt == null) updatedAt = now;
    }

    @PreUpdate
    protected void onUpdate() {
        updatedAt = Instant.now();
    }

    // Getters and Setters
    public UUID getAppId() { return appId; }
    public void setAppId(UUID appId) { this.appId = appId; }
    public UUID getCitizenId() { return citizenId; }
    public void setCitizenId(UUID citizenId) { this.citizenId = citizenId; }
    public ApplicationType getApplicationType() { return applicationType; }
    public void setApplicationType(ApplicationType applicationType) { this.applicationType = applicationType; }
    public ApplicationCategory getCategory() { return category; }
    public void setCategory(ApplicationCategory category) { this.category = category; }
    public ApplicationStage getCurrentStage() { return currentStage; }
    public void setCurrentStage(ApplicationStage currentStage) { this.currentStage = currentStage; }
    public Map<String, Object> getFormData() { return formData; }
    public void setFormData(Map<String, Object> formData) { this.formData = formData; }
    public String getFileNumber() { return fileNumber; }
    public void setFileNumber(String fileNumber) { this.fileNumber = fileNumber; }
    public BigDecimal getFeeAmount() { return feeAmount; }
    public void setFeeAmount(BigDecimal feeAmount) { this.feeAmount = feeAmount; }
    public boolean isFeePaid() { return feePaid; }
    public void setFeePaid(boolean feePaid) { this.feePaid = feePaid; }
    public boolean isTatkaal() { return tatkaal; }
    public void setTatkaal(boolean tatkaal) { this.tatkaal = tatkaal; }
    public Instant getSubmittedAt() { return submittedAt; }
    public void setSubmittedAt(Instant submittedAt) { this.submittedAt = submittedAt; }
    public Instant getSlaDeadline() { return slaDeadline; }
    public void setSlaDeadline(Instant slaDeadline) { this.slaDeadline = slaDeadline; }
    public Instant getCreatedAt() { return createdAt; }
    public Instant getUpdatedAt() { return updatedAt; }
}
