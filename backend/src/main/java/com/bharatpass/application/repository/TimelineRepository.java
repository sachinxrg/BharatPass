package com.bharatpass.application.repository;

import com.bharatpass.application.entity.ApplicationTimeline;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.UUID;

@Repository
public interface TimelineRepository extends JpaRepository<ApplicationTimeline, UUID> {
    List<ApplicationTimeline> findByAppIdOrderByCreatedAtAsc(UUID appId);
}
