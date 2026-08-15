package com.bharatpass.events.controller;

import com.bharatpass.events.service.EventPublisherService;
import org.springframework.http.MediaType;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.servlet.mvc.method.annotation.SseEmitter;

import java.time.LocalDate;
import java.util.UUID;

@RestController
@RequestMapping("/api/v1/events")
public class SseController {

    private final EventPublisherService eventPublisher;

    public SseController(EventPublisherService eventPublisher) {
        this.eventPublisher = eventPublisher;
    }

    @GetMapping(value = "/application/{appId}", produces = MediaType.TEXT_EVENT_STREAM_VALUE)
    public SseEmitter streamApplicationEvents(@PathVariable UUID appId) {
        return eventPublisher.subscribeToApplication(appId);
    }

    @GetMapping(value = "/slots/{pskId}/{date}", produces = MediaType.TEXT_EVENT_STREAM_VALUE)
    public SseEmitter streamSlotEvents(@PathVariable UUID pskId, @PathVariable String date) {
        return eventPublisher.subscribeToSlots(pskId, LocalDate.parse(date));
    }
}
