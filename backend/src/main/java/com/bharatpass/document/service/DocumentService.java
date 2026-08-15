package com.bharatpass.document.service;

import com.bharatpass.common.enums.DocumentType;
import com.bharatpass.document.entity.Document;
import com.bharatpass.document.repository.DocumentRepository;
import io.minio.MinioClient;
import io.minio.PutObjectArgs;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Service;
import org.springframework.web.multipart.MultipartFile;

import java.io.InputStream;
import java.util.*;

/**
 * Document service handling file upload to MinIO + mock OCR analysis.
 * In production, integrates with Tesseract OCR and Apache Tika.
 */
@Service
public class DocumentService {

    private final DocumentRepository documentRepository;
    private final MinioClient minioClient;
    private final String bucketName;

    public DocumentService(DocumentRepository documentRepository,
                           MinioClient minioClient,
                           @Value("${bharatpass.minio.bucket-name}") String bucketName) {
        this.documentRepository = documentRepository;
        this.minioClient = minioClient;
        this.bucketName = bucketName;
    }

    public Document uploadAndAnalyze(UUID appId, DocumentType docType, MultipartFile file) throws Exception {
        // Upload to MinIO
        String objectKey = appId + "/" + docType + "/" + UUID.randomUUID() + "_" + file.getOriginalFilename();
        try (InputStream is = file.getInputStream()) {
            minioClient.putObject(PutObjectArgs.builder()
                    .bucket(bucketName)
                    .object(objectKey)
                    .stream(is, file.getSize(), -1)
                    .contentType(file.getContentType())
                    .build());
        }

        // Perform mock OCR analysis
        Map<String, Object> ocrResult = performOcrAnalysis(file, docType);
        int ocrScore = (int) ocrResult.get("score");
        boolean qualityPassed = ocrScore >= 60;

        Document doc = new Document();
        doc.setAppId(appId);
        doc.setDocType(docType);
        doc.setFilePath(objectKey);
        doc.setOcrScore(ocrScore);
        doc.setOcrResultJson(ocrResult);
        doc.setQualityPassed(qualityPassed);

        return documentRepository.save(doc);
    }

    public List<Document> getDocuments(UUID appId) {
        return documentRepository.findByAppIdOrderByUploadedAtDesc(appId);
    }

    /**
     * Mock OCR analysis — simulates document quality checks.
     * In production: Apache Tika for format detection + Tesseract for text extraction.
     */
    private Map<String, Object> performOcrAnalysis(MultipartFile file, DocumentType docType) {
        Map<String, Object> result = new HashMap<>();
        Random random = new Random();

        // Simulate quality checks
        int resolutionScore = 70 + random.nextInt(30);    // 70-100
        int clarityScore = 60 + random.nextInt(40);       // 60-100
        int completenessScore = 75 + random.nextInt(25);  // 75-100

        int overallScore = (resolutionScore + clarityScore + completenessScore) / 3;

        result.put("score", overallScore);
        result.put("resolution", Map.of("score", resolutionScore, "status", resolutionScore >= 70 ? "PASS" : "FAIL"));
        result.put("clarity", Map.of("score", clarityScore, "status", clarityScore >= 60 ? "PASS" : "FAIL"));
        result.put("completeness", Map.of("score", completenessScore, "status", completenessScore >= 75 ? "PASS" : "FAIL"));

        List<String> issues = new ArrayList<>();
        if (clarityScore < 70) issues.add("Image appears blurry — re-upload a clearer scan");
        if (resolutionScore < 80) issues.add("Low resolution — use at least 300 DPI");

        result.put("issues", issues);
        result.put("extractedText", "MOCK: " + docType.name() + " content extracted");

        return result;
    }
}
