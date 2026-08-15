package com.bharatpass.document.controller;

import com.bharatpass.common.enums.DocumentType;
import com.bharatpass.document.entity.Document;
import com.bharatpass.document.service.DocumentService;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;

import java.util.List;
import java.util.Map;
import java.util.UUID;

@RestController
@RequestMapping("/api/v1/applications/{appId}/documents")
public class DocumentController {

    private final DocumentService documentService;

    public DocumentController(DocumentService documentService) {
        this.documentService = documentService;
    }

    @PostMapping
    public ResponseEntity<?> uploadDocument(
            @PathVariable UUID appId,
            @RequestParam("file") MultipartFile file,
            @RequestParam("docType") String docType) throws Exception {
        DocumentType type = DocumentType.valueOf(docType);
        Document doc = documentService.uploadAndAnalyze(appId, type, file);

        return ResponseEntity.status(HttpStatus.CREATED).body(Map.of(
                "docId", doc.getDocId(),
                "ocrScore", doc.getOcrScore(),
                "qualityPassed", doc.getQualityPassed(),
                "issues", doc.getOcrResultJson().getOrDefault("issues", List.of())
        ));
    }

    @GetMapping
    public ResponseEntity<List<Document>> getDocuments(@PathVariable UUID appId) {
        return ResponseEntity.ok(documentService.getDocuments(appId));
    }
}
