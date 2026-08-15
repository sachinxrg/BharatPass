package com.bharatpass.booking.entity;

import jakarta.persistence.*;
import java.util.UUID;

@Entity
@Table(name = "psk_centers")
public class PskCenter {

    @Id
    @GeneratedValue(strategy = GenerationType.UUID)
    @Column(name = "psk_id")
    private UUID pskId;

    @Column(name = "name", nullable = false, length = 200)
    private String name;

    @Column(name = "city", nullable = false, length = 100)
    private String city;

    @Column(name = "state", nullable = false, length = 100)
    private String state;

    @Column(name = "address", columnDefinition = "TEXT")
    private String address;

    @Column(name = "daily_capacity", nullable = false)
    private int dailyCapacity;

    @Column(name = "rpo_code", nullable = false, length = 10)
    private String rpoCode;

    @Column(name = "active", nullable = false)
    private boolean active = true;

    // Getters and Setters
    public UUID getPskId() { return pskId; }
    public void setPskId(UUID pskId) { this.pskId = pskId; }
    public String getName() { return name; }
    public void setName(String name) { this.name = name; }
    public String getCity() { return city; }
    public void setCity(String city) { this.city = city; }
    public String getState() { return state; }
    public void setState(String state) { this.state = state; }
    public String getAddress() { return address; }
    public void setAddress(String address) { this.address = address; }
    public int getDailyCapacity() { return dailyCapacity; }
    public void setDailyCapacity(int dailyCapacity) { this.dailyCapacity = dailyCapacity; }
    public String getRpoCode() { return rpoCode; }
    public void setRpoCode(String rpoCode) { this.rpoCode = rpoCode; }
    public boolean isActive() { return active; }
    public void setActive(boolean active) { this.active = active; }
}
