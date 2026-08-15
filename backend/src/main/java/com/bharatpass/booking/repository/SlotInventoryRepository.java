package com.bharatpass.booking.repository;

import com.bharatpass.booking.entity.SlotInventory;
import com.bharatpass.common.enums.TimeWindow;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.time.LocalDate;
import java.util.List;
import java.util.Optional;
import java.util.UUID;

@Repository
public interface SlotInventoryRepository extends JpaRepository<SlotInventory, UUID> {
    List<SlotInventory> findByPskIdAndSlotDate(UUID pskId, LocalDate slotDate);
    Optional<SlotInventory> findByPskIdAndSlotDateAndTimeWindow(UUID pskId, LocalDate slotDate, TimeWindow timeWindow);
}
