-- V3: Citizens table
CREATE TABLE citizens (
    citizen_id       UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    vault_ref_key    UUID REFERENCES aadhaar_vault(reference_key),
    full_name        VARCHAR(200) NOT NULL,
    date_of_birth    DATE NOT NULL,
    gender           gender_type NOT NULL,
    mobile_hash      VARCHAR(64),
    email            VARCHAR(255),
    address_json     JSONB,
    photo_url        VARCHAR(500),
    ekyc_verified    BOOLEAN NOT NULL DEFAULT FALSE,
    digilocker_linked BOOLEAN NOT NULL DEFAULT FALSE,
    role             user_role NOT NULL DEFAULT 'ROLE_CITIZEN',
    created_at       TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    updated_at       TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE INDEX idx_citizens_vault_ref ON citizens(vault_ref_key);
CREATE INDEX idx_citizens_email ON citizens(email);
