package com.bharatpass.document.entity;

import com.bharatpass.common.enums.DocumentType;
import jakarta.persistence.*;
import org.hibernate.annotations.JdbcTypeCode;
import org.hibernate.type.SqlTypes;

import java.time.Instant;
import java.util.Map;
import java.util.UUID;

@Entity
@Table(name = "documents")
public class Document {

    @Id
    @GeneratedValue(strategy = GenerationType.UUID)
    @Column(name = "doc_id")
    private UUID docId;

    @Column(name = "app_id", nullable = false)
    private UUID appId;

    @Enumerated(EnumType.STRING)
    @Column(name = "doc_type", nullable = false, columnDefinition = "document_type")
    private DocumentType docType;

    @Column(name = "file_path", nullable = false, length = 500)
    private String filePath;

    @Column(name = "ocr_score")
    private Integer ocrScore;

    @JdbcTypeCode(SqlTypes.JSON)
    @Column(name = "ocr_result_json", columnDefinition = "jsonb")
    private Map<String, Object> ocrResultJson;

    @Column(name = "quality_passed")
    private Boolean qualityPassed;

    @Column(name = "uploaded_at", nullable = false)
    private Instant uploadedAt;

    @PrePersist
    protected void onCreate() {
        if (uploadedAt == null) uploadedAt = Instant.now();
    }

    // Getters and Setters
    public UUID getDocId() { return docId; }
    public void setDocId(UUID docId) { this.docId = docId; }
    public UUID getAppId() { return appId; }
    public void setAppId(UUID appId) { this.appId = appId; }
    public DocumentType getDocType() { return docType; }
    public void setDocType(DocumentType docType) { this.docType = docType; }
    public String getFilePath() { return filePath; }
    public void setFilePath(String filePath) { this.filePath = filePath; }
    public Integer getOcrScore() { return ocrScore; }
    public void setOcrScore(Integer ocrScore) { this.ocrScore = ocrScore; }
    public Map<String, Object> getOcrResultJson() { return ocrResultJson; }
    public void setOcrResultJson(Map<String, Object> ocrResultJson) { this.ocrResultJson = ocrResultJson; }
    public Boolean getQualityPassed() { return qualityPassed; }
    public void setQualityPassed(Boolean qualityPassed) { this.qualityPassed = qualityPassed; }
    public Instant getUploadedAt() { return uploadedAt; }
}
