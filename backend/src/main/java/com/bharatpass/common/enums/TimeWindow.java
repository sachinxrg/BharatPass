package com.bharatpass.common.enums;

public enum TimeWindow {
    SLOT_0900,
    SLOT_0930,
    SLOT_1000,
    SLOT_1030,
    SLOT_1100,
    SLOT_1130,
    SLOT_1200,
    SLOT_1230,
    SLOT_1300,
    SLOT_1330,
    SLOT_1400,
    SLOT_1430,
    SLOT_1500,
    SLOT_1530;

    public String toDisplayTime() {
        String raw = name().replace("SLOT_", "");
        return raw.substring(0, 2) + ":" + raw.substring(2);
    }
}
