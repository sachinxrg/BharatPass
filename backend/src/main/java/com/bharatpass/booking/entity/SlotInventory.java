package com.bharatpass.booking.entity;

import com.bharatpass.common.enums.TimeWindow;
import jakarta.persistence.*;
import java.time.LocalDate;
import java.util.UUID;

@Entity
@Table(name = "slot_inventory", uniqueConstraints = @UniqueConstraint(columnNames = {"psk_id", "slot_date", "time_window"}))
public class SlotInventory {

    @Id
    @GeneratedValue(strategy = GenerationType.UUID)
    @Column(name = "slot_id")
    private UUID slotId;

    @Column(name = "psk_id", nullable = false)
    private UUID pskId;

    @Column(name = "slot_date", nullable = false)
    private LocalDate slotDate;

    @Enumerated(EnumType.STRING)
    @Column(name = "time_window", nullable = false, columnDefinition = "time_window")
    private TimeWindow timeWindow;

    @Column(name = "total_capacity", nullable = false)
    private int totalCapacity;

    @Column(name = "booked_count", nullable = false)
    private int bookedCount = 0;

    @Column(name = "locked_count", nullable = false)
    private int lockedCount = 0;

    @Version
    @Column(name = "version", nullable = false)
    private long version;

    public int getAvailableCount() {
        return totalCapacity - bookedCount - lockedCount;
    }

    // Getters and Setters
    public UUID getSlotId() { return slotId; }
    public void setSlotId(UUID slotId) { this.slotId = slotId; }
    public UUID getPskId() { return pskId; }
    public void setPskId(UUID pskId) { this.pskId = pskId; }
    public LocalDate getSlotDate() { return slotDate; }
    public void setSlotDate(LocalDate slotDate) { this.slotDate = slotDate; }
    public TimeWindow getTimeWindow() { return timeWindow; }
    public void setTimeWindow(TimeWindow timeWindow) { this.timeWindow = timeWindow; }
    public int getTotalCapacity() { return totalCapacity; }
    public void setTotalCapacity(int totalCapacity) { this.totalCapacity = totalCapacity; }
    public int getBookedCount() { return bookedCount; }
    public void setBookedCount(int bookedCount) { this.bookedCount = bookedCount; }
    public int getLockedCount() { return lockedCount; }
    public void setLockedCount(int lockedCount) { this.lockedCount = lockedCount; }
    public long getVersion() { return version; }
}
