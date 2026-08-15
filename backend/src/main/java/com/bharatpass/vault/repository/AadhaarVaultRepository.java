package com.bharatpass.vault.repository;

import com.bharatpass.vault.entity.AadhaarVaultEntry;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.Optional;
import java.util.UUID;

@Repository
public interface AadhaarVaultRepository extends JpaRepository<AadhaarVaultEntry, UUID> {
    Optional<AadhaarVaultEntry> findByReferenceKey(UUID referenceKey);
}
