package com.bharatpass.application.repository;

import com.bharatpass.application.entity.PassportApplication;
import com.bharatpass.common.enums.ApplicationStage;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.UUID;

@Repository
public interface ApplicationRepository extends JpaRepository<PassportApplication, UUID> {
    List<PassportApplication> findByCitizenIdOrderByCreatedAtDesc(UUID citizenId);
    Page<PassportApplication> findByCurrentStage(ApplicationStage stage, Pageable pageable);
    long countByCurrentStage(ApplicationStage stage);
}
