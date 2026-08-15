package com.bharatpass.police.entity;

import com.bharatpass.common.enums.VerificationVerdict;
import jakarta.persistence.*;
import org.hibernate.annotations.JdbcTypeCode;
import org.hibernate.type.SqlTypes;

import java.math.BigDecimal;
import java.time.Instant;
import java.util.Map;
import java.util.UUID;

@Entity
@Table(name = "police_verifications")
public class PoliceVerification {

    @Id
    @GeneratedValue(strategy = GenerationType.UUID)
    @Column(name = "pv_id")
    private UUID pvId;

    @Column(name = "app_id", nullable = false)
    private UUID appId;

    @Column(name = "officer_id")
    private UUID officerId;

    @Column(name = "dispatch_date", nullable = false)
    private Instant dispatchDate;

    @Column(name = "visit_date")
    private Instant visitDate;

    @Column(name = "gps_latitude", precision = 9, scale = 6)
    private BigDecimal gpsLatitude;

    @Column(name = "gps_longitude", precision = 9, scale = 6)
    private BigDecimal gpsLongitude;

    @JdbcTypeCode(SqlTypes.JSON)
    @Column(name = "checklist_json", columnDefinition = "jsonb")
    private Map<String, Object> checklistJson;

    @Enumerated(EnumType.STRING)
    @Column(name = "verdict", columnDefinition = "verification_verdict")
    private VerificationVerdict verdict;

    @Column(name = "digital_signature", columnDefinition = "TEXT")
    private String digitalSignature;

    @Column(name = "remarks", columnDefinition = "TEXT")
    private String remarks;

    @Column(name = "submitted_at")
    private Instant submittedAt;

    @PrePersist
    protected void onCreate() {
        if (dispatchDate == null) dispatchDate = Instant.now();
    }

    // Getters and Setters
    public UUID getPvId() { return pvId; }
    public void setPvId(UUID pvId) { this.pvId = pvId; }
    public UUID getAppId() { return appId; }
    public void setAppId(UUID appId) { this.appId = appId; }
    public UUID getOfficerId() { return officerId; }
    public void setOfficerId(UUID officerId) { this.officerId = officerId; }
    public Instant getDispatchDate() { return dispatchDate; }
    public void setDispatchDate(Instant dispatchDate) { this.dispatchDate = dispatchDate; }
    public Instant getVisitDate() { return visitDate; }
    public void setVisitDate(Instant visitDate) { this.visitDate = visitDate; }
    public BigDecimal getGpsLatitude() { return gpsLatitude; }
    public void setGpsLatitude(BigDecimal gpsLatitude) { this.gpsLatitude = gpsLatitude; }
    public BigDecimal getGpsLongitude() { return gpsLongitude; }
    public void setGpsLongitude(BigDecimal gpsLongitude) { this.gpsLongitude = gpsLongitude; }
    public Map<String, Object> getChecklistJson() { return checklistJson; }
    public void setChecklistJson(Map<String, Object> checklistJson) { this.checklistJson = checklistJson; }
    public VerificationVerdict getVerdict() { return verdict; }
    public void setVerdict(VerificationVerdict verdict) { this.verdict = verdict; }
    public String getDigitalSignature() { return digitalSignature; }
    public void setDigitalSignature(String digitalSignature) { this.digitalSignature = digitalSignature; }
    public String getRemarks() { return remarks; }
    public void setRemarks(String remarks) { this.remarks = remarks; }
    public Instant getSubmittedAt() { return submittedAt; }
    public void setSubmittedAt(Instant submittedAt) { this.submittedAt = submittedAt; }
}
