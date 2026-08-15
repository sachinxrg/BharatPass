package com.bharatpass.booking.entity;

import com.bharatpass.common.enums.AppointmentStatus;
import com.bharatpass.common.enums.TimeWindow;
import jakarta.persistence.*;
import java.time.Instant;
import java.time.LocalDate;
import java.util.UUID;

@Entity
@Table(name = "appointments")
public class Appointment {

    @Id
    @GeneratedValue(strategy = GenerationType.UUID)
    @Column(name = "appointment_id")
    private UUID appointmentId;

    @Column(name = "app_id", nullable = false)
    private UUID appId;

    @Column(name = "psk_id", nullable = false)
    private UUID pskId;

    @Column(name = "slot_date", nullable = false)
    private LocalDate slotDate;

    @Enumerated(EnumType.STRING)
    @Column(name = "time_window", nullable = false, columnDefinition = "time_window")
    private TimeWindow timeWindow;

    @Enumerated(EnumType.STRING)
    @Column(name = "status", nullable = false, columnDefinition = "appointment_status")
    private AppointmentStatus status = AppointmentStatus.RESERVED;

    @Column(name = "booked_at", nullable = false)
    private Instant bookedAt;

    @Column(name = "lock_expiry")
    private Instant lockExpiry;

    @PrePersist
    protected void onCreate() {
        if (bookedAt == null) bookedAt = Instant.now();
    }

    // Getters and Setters
    public UUID getAppointmentId() { return appointmentId; }
    public void setAppointmentId(UUID appointmentId) { this.appointmentId = appointmentId; }
    public UUID getAppId() { return appId; }
    public void setAppId(UUID appId) { this.appId = appId; }
    public UUID getPskId() { return pskId; }
    public void setPskId(UUID pskId) { this.pskId = pskId; }
    public LocalDate getSlotDate() { return slotDate; }
    public void setSlotDate(LocalDate slotDate) { this.slotDate = slotDate; }
    public TimeWindow getTimeWindow() { return timeWindow; }
    public void setTimeWindow(TimeWindow timeWindow) { this.timeWindow = timeWindow; }
    public AppointmentStatus getStatus() { return status; }
    public void setStatus(AppointmentStatus status) { this.status = status; }
    public Instant getBookedAt() { return bookedAt; }
    public void setBookedAt(Instant bookedAt) { this.bookedAt = bookedAt; }
    public Instant getLockExpiry() { return lockExpiry; }
    public void setLockExpiry(Instant lockExpiry) { this.lockExpiry = lockExpiry; }
}
