package com.bharatpass.booking.controller;

import com.bharatpass.booking.entity.Appointment;
import com.bharatpass.booking.service.SlotBookingService;
import com.bharatpass.common.enums.TimeWindow;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.time.LocalDate;
import java.util.List;
import java.util.Map;
import java.util.UUID;

@RestController
@RequestMapping("/api/v1/slots")
public class SlotBookingController {

    private final SlotBookingService bookingService;

    public SlotBookingController(SlotBookingService bookingService) {
        this.bookingService = bookingService;
    }

    @GetMapping("/availability")
    public ResponseEntity<?> getAvailability(
            @RequestParam UUID pskId,
            @RequestParam String date) {
        LocalDate slotDate = LocalDate.parse(date);
        List<Map<String, Object>> availability = bookingService.getAvailability(pskId, slotDate);
        return ResponseEntity.ok(Map.of("slots", availability));
    }

    @PostMapping("/reserve")
    public ResponseEntity<?> reserveSlot(@RequestBody Map<String, String> body) {
        UUID appId = UUID.fromString(body.get("appId"));
        UUID pskId = UUID.fromString(body.get("pskId"));
        LocalDate date = LocalDate.parse(body.get("date"));
        TimeWindow timeWindow = TimeWindow.valueOf(body.get("timeWindow"));

        Appointment appointment = bookingService.reserveSlot(appId, pskId, date, timeWindow);

        return ResponseEntity.ok(Map.of(
                "appointmentId", appointment.getAppointmentId(),
                "lockExpiry", appointment.getLockExpiry().toString(),
                "status", appointment.getStatus().name()
        ));
    }

    @PostMapping("/confirm")
    public ResponseEntity<?> confirmSlot(@RequestBody Map<String, String> body) {
        UUID appointmentId = UUID.fromString(body.get("appointmentId"));
        String paymentRef = body.get("paymentRef");

        Appointment appointment = bookingService.confirmSlot(appointmentId, paymentRef);

        return ResponseEntity.ok(Map.of(
                "appointmentId", appointment.getAppointmentId(),
                "status", appointment.getStatus().name()
        ));
    }

    @DeleteMapping("/release/{appointmentId}")
    public ResponseEntity<?> releaseSlot(@PathVariable UUID appointmentId) {
        bookingService.releaseSlot(appointmentId);
        return ResponseEntity.ok(Map.of("released", true));
    }
}
