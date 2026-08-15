-- V7: Police Verification tables
CREATE TABLE officers (
    officer_id      UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    name            VARCHAR(200) NOT NULL,
    badge_number    VARCHAR(50) UNIQUE,
    designation     VARCHAR(100),
    station         VARCHAR(200),
    jurisdiction_json JSONB,
    mobile_hash     VARCHAR(64),
    role            user_role NOT NULL DEFAULT 'ROLE_POLICE_OFFICER',
    active          BOOLEAN NOT NULL DEFAULT TRUE
);

CREATE TABLE police_verifications (
    pv_id           UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    app_id          UUID NOT NULL REFERENCES passport_applications(app_id),
    officer_id      UUID REFERENCES officers(officer_id),
    dispatch_date   TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    visit_date      TIMESTAMPTZ,
    gps_latitude    DECIMAL(9, 6),
    gps_longitude   DECIMAL(9, 6),
    checklist_json  JSONB,
    verdict         verification_verdict,
    digital_signature TEXT,
    remarks         TEXT,
    submitted_at    TIMESTAMPTZ
);

CREATE INDEX idx_pv_app ON police_verifications(app_id);
CREATE INDEX idx_pv_officer ON police_verifications(officer_id);
CREATE INDEX idx_pv_verdict ON police_verifications(verdict);

-- Seed demo officers
INSERT INTO officers (name, badge_number, designation, station) VALUES
    ('Inspector Rajesh Kumar', 'KA-BLR-2145', 'Sub-Inspector', 'Koramangala PS'),
    ('Inspector Priya Sharma', 'MH-MUM-3892', 'Inspector', 'Andheri PS'),
    ('Inspector Amit Singh', 'DL-NDL-1567', 'Sub-Inspector', 'Laxmi Nagar PS');
