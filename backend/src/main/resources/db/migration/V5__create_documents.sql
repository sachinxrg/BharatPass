-- V5: Documents table with OCR metadata
CREATE TABLE documents (
    doc_id          UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    app_id          UUID NOT NULL REFERENCES passport_applications(app_id),
    doc_type        document_type NOT NULL,
    file_path       VARCHAR(500) NOT NULL,
    ocr_score       INT CHECK (ocr_score >= 0 AND ocr_score <= 100),
    ocr_result_json JSONB,
    quality_passed  BOOLEAN,
    uploaded_at     TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE INDEX idx_documents_app ON documents(app_id);
