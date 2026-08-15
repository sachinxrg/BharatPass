package com.bharatpass.auth.repository;

import com.bharatpass.auth.entity.Citizen;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.Optional;
import java.util.UUID;

@Repository
public interface CitizenRepository extends JpaRepository<Citizen, UUID> {
    Optional<Citizen> findByVaultRefKey(UUID vaultRefKey);
    Optional<Citizen> findByEmail(String email);
}
