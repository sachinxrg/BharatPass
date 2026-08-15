-- V4: Passport Applications table
CREATE TABLE passport_applications (
    app_id          UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    citizen_id      UUID NOT NULL REFERENCES citizens(citizen_id),
    application_type application_type NOT NULL,
    category        application_category NOT NULL DEFAULT 'NORMAL',
    current_stage   application_stage NOT NULL DEFAULT 'INITIATED',
    form_data       JSONB,
    file_number     VARCHAR(30) UNIQUE,
    fee_amount      DECIMAL(10, 2),
    fee_paid        BOOLEAN NOT NULL DEFAULT FALSE,
    tatkaal         BOOLEAN NOT NULL DEFAULT FALSE,
    submitted_at    TIMESTAMPTZ,
    sla_deadline    TIMESTAMPTZ,
    created_at      TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    updated_at      TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE INDEX idx_applications_citizen ON passport_applications(citizen_id);
CREATE INDEX idx_applications_stage ON passport_applications(current_stage);
CREATE INDEX idx_applications_file_number ON passport_applications(file_number);
