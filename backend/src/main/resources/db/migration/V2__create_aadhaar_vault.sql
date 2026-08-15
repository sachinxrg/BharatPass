-- V2: Aadhaar Data Vault (UIDAI Compliance — isolated encrypted storage)
CREATE TABLE aadhaar_vault (
    vault_id       UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    encrypted_aadhaar BYTEA NOT NULL,
    reference_key  UUID NOT NULL UNIQUE DEFAULT gen_random_uuid(),
    encryption_key_id VARCHAR(64) NOT NULL,
    created_at     TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    rotated_at     TIMESTAMPTZ
);

CREATE INDEX idx_vault_reference_key ON aadhaar_vault(reference_key);
