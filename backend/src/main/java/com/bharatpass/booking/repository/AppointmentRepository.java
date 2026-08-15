package com.bharatpass.booking.repository;

import com.bharatpass.booking.entity.Appointment;
import com.bharatpass.common.enums.AppointmentStatus;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.UUID;

@Repository
public interface AppointmentRepository extends JpaRepository<Appointment, UUID> {
    List<Appointment> findByAppId(UUID appId);
    List<Appointment> findByStatus(AppointmentStatus status);
}
