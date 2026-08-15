package com.bharatpass.police.repository;

import com.bharatpass.police.entity.PoliceVerification;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.UUID;

@Repository
public interface PoliceVerificationRepository extends JpaRepository<PoliceVerification, UUID> {
    List<PoliceVerification> findByOfficerIdAndVerdictIsNullOrderByDispatchDateDesc(UUID officerId);
    List<PoliceVerification> findByAppId(UUID appId);
}
