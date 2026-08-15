-- V6: PSK Centers, Slot Inventory, and Appointments
CREATE TABLE psk_centers (
    psk_id          UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    name            VARCHAR(200) NOT NULL,
    city            VARCHAR(100) NOT NULL,
    state           VARCHAR(100) NOT NULL,
    address         TEXT,
    daily_capacity  INT NOT NULL DEFAULT 100,
    rpo_code        VARCHAR(10) NOT NULL,
    active          BOOLEAN NOT NULL DEFAULT TRUE
);

CREATE TABLE slot_inventory (
    slot_id         UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    psk_id          UUID NOT NULL REFERENCES psk_centers(psk_id),
    slot_date       DATE NOT NULL,
    time_window     time_window NOT NULL,
    total_capacity  INT NOT NULL,
    booked_count    INT NOT NULL DEFAULT 0,
    locked_count    INT NOT NULL DEFAULT 0,
    version         BIGINT NOT NULL DEFAULT 0,
    UNIQUE(psk_id, slot_date, time_window)
);

CREATE INDEX idx_slot_availability ON slot_inventory(psk_id, slot_date);

CREATE TABLE appointments (
    appointment_id  UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    app_id          UUID NOT NULL REFERENCES passport_applications(app_id),
    psk_id          UUID NOT NULL REFERENCES psk_centers(psk_id),
    slot_date       DATE NOT NULL,
    time_window     time_window NOT NULL,
    status          appointment_status NOT NULL DEFAULT 'RESERVED',
    booked_at       TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    lock_expiry     TIMESTAMPTZ
);

CREATE INDEX idx_appointments_app ON appointments(app_id);
CREATE INDEX idx_appointments_status ON appointments(status);

-- Seed PSK Centers
INSERT INTO psk_centers (name, city, state, rpo_code, daily_capacity) VALUES
    ('PSK Bengaluru', 'Bengaluru', 'Karnataka', 'BLR', 200),
    ('PSK Mumbai (Malad)', 'Mumbai', 'Maharashtra', 'MUM', 250),
    ('PSK Delhi (Laxmi Nagar)', 'New Delhi', 'Delhi', 'DEL', 220),
    ('PSK Chennai', 'Chennai', 'Tamil Nadu', 'CHN', 180),
    ('PSK Kolkata', 'Kolkata', 'West Bengal', 'KOL', 160),
    ('PSK Hyderabad', 'Hyderabad', 'Telangana', 'HYD', 190),
    ('PSK Pune', 'Pune', 'Maharashtra', 'PUN', 150),
    ('PSK Ahmedabad', 'Ahmedabad', 'Gujarat', 'AMD', 170),
    ('PSK Lucknow', 'Lucknow', 'Uttar Pradesh', 'LKO', 140),
    ('PSK Jaipur', 'Jaipur', 'Rajasthan', 'JAI', 130);
