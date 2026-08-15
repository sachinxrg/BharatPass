package com.bharatpass.document.repository;

import com.bharatpass.document.entity.Document;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.UUID;

@Repository
public interface DocumentRepository extends JpaRepository<Document, UUID> {
    List<Document> findByAppIdOrderByUploadedAtDesc(UUID appId);
}
