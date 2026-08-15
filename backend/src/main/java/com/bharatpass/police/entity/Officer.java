package com.bharatpass.police.entity;

import jakarta.persistence.*;
import org.hibernate.annotations.JdbcTypeCode;
import org.hibernate.type.SqlTypes;

import java.util.Map;
import java.util.UUID;

@Entity
@Table(name = "officers")
public class Officer {

    @Id
    @GeneratedValue(strategy = GenerationType.UUID)
    @Column(name = "officer_id")
    private UUID officerId;

    @Column(name = "name", nullable = false, length = 200)
    private String name;

    @Column(name = "badge_number", unique = true, length = 50)
    private String badgeNumber;

    @Column(name = "designation", length = 100)
    private String designation;

    @Column(name = "station", length = 200)
    private String station;

    @JdbcTypeCode(SqlTypes.JSON)
    @Column(name = "jurisdiction_json", columnDefinition = "jsonb")
    private Map<String, Object> jurisdictionJson;

    @Column(name = "mobile_hash", length = 64)
    private String mobileHash;

    @Column(name = "role", nullable = false, columnDefinition = "user_role")
    private String role = "ROLE_POLICE_OFFICER";

    @Column(name = "active", nullable = false)
    private boolean active = true;

    // Getters and Setters
    public UUID getOfficerId() { return officerId; }
    public void setOfficerId(UUID officerId) { this.officerId = officerId; }
    public String getName() { return name; }
    public void setName(String name) { this.name = name; }
    public String getBadgeNumber() { return badgeNumber; }
    public void setBadgeNumber(String badgeNumber) { this.badgeNumber = badgeNumber; }
    public String getDesignation() { return designation; }
    public void setDesignation(String designation) { this.designation = designation; }
    public String getStation() { return station; }
    public void setStation(String station) { this.station = station; }
    public Map<String, Object> getJurisdictionJson() { return jurisdictionJson; }
    public void setJurisdictionJson(Map<String, Object> jurisdictionJson) { this.jurisdictionJson = jurisdictionJson; }
    public String getMobileHash() { return mobileHash; }
    public void setMobileHash(String mobileHash) { this.mobileHash = mobileHash; }
    public boolean isActive() { return active; }
    public void setActive(boolean active) { this.active = active; }
}
