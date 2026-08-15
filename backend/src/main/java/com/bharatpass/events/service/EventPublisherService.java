package com.bharatpass.events.service;

import org.springframework.stereotype.Service;
import org.springframework.web.servlet.mvc.method.annotation.SseEmitter;

import java.time.LocalDate;
import java.util.Map;
import java.util.UUID;
import java.util.concurrent.ConcurrentHashMap;
import java.util.concurrent.CopyOnWriteArrayList;

/**
 * SSE Event Publisher for real-time updates.
 * Manages per-application and per-slot SSE connections.
 */
@Service
public class EventPublisherService {

    private final Map<UUID, CopyOnWriteArrayList<SseEmitter>> applicationEmitters = new ConcurrentHashMap<>();
    private final Map<String, CopyOnWriteArrayList<SseEmitter>> slotEmitters = new ConcurrentHashMap<>();

    public SseEmitter subscribeToApplication(UUID appId) {
        SseEmitter emitter = new SseEmitter(0L); // No timeout
        applicationEmitters.computeIfAbsent(appId, k -> new CopyOnWriteArrayList<>()).add(emitter);
        emitter.onCompletion(() -> removeApplicationEmitter(appId, emitter));
        emitter.onTimeout(() -> removeApplicationEmitter(appId, emitter));
        emitter.onError(e -> removeApplicationEmitter(appId, emitter));
        return emitter;
    }

    public SseEmitter subscribeToSlots(UUID pskId, LocalDate date) {
        String key = pskId + ":" + date;
        SseEmitter emitter = new SseEmitter(0L);
        slotEmitters.computeIfAbsent(key, k -> new CopyOnWriteArrayList<>()).add(emitter);
        emitter.onCompletion(() -> removeSlotEmitter(key, emitter));
        emitter.onTimeout(() -> removeSlotEmitter(key, emitter));
        emitter.onError(e -> removeSlotEmitter(key, emitter));
        return emitter;
    }

    public void publishStageChange(UUID appId, String oldStage, String newStage) {
        sendToApplication(appId, "stage_changed", Map.of(
                "appId", appId.toString(),
                "oldStage", oldStage,
                "newStage", newStage,
                "timestamp", System.currentTimeMillis()
        ));
    }

    public void publishPvUpdate(UUID appId, String verdict) {
        sendToApplication(appId, "pv_update", Map.of(
                "appId", appId.toString(),
                "verdict", verdict,
                "timestamp", System.currentTimeMillis()
        ));
    }

    public void publishSlotUpdate(UUID pskId, LocalDate date, String timeWindow, int available) {
        String key = pskId + ":" + date;
        CopyOnWriteArrayList<SseEmitter> emitters = slotEmitters.get(key);
        if (emitters != null) {
            for (SseEmitter emitter : emitters) {
                try {
                    emitter.send(SseEmitter.event()
                            .name("slot_update")
                            .data(Map.of(
                                    "timeWindow", timeWindow,
                                    "available", available,
                                    "timestamp", System.currentTimeMillis()
                            )));
                } catch (Exception e) {
                    removeSlotEmitter(key, emitter);
                }
            }
        }
    }

    private void sendToApplication(UUID appId, String eventName, Map<String, Object> data) {
        CopyOnWriteArrayList<SseEmitter> emitters = applicationEmitters.get(appId);
        if (emitters != null) {
            for (SseEmitter emitter : emitters) {
                try {
                    emitter.send(SseEmitter.event().name(eventName).data(data));
                } catch (Exception e) {
                    removeApplicationEmitter(appId, emitter);
                }
            }
        }
    }

    private void removeApplicationEmitter(UUID appId, SseEmitter emitter) {
        CopyOnWriteArrayList<SseEmitter> emitters = applicationEmitters.get(appId);
        if (emitters != null) {
            emitters.remove(emitter);
        }
    }

    private void removeSlotEmitter(String key, SseEmitter emitter) {
        CopyOnWriteArrayList<SseEmitter> emitters = slotEmitters.get(key);
        if (emitters != null) {
            emitters.remove(emitter);
        }
    }
}
