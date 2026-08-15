-- V8: Application Timeline (immutable audit log)
CREATE TABLE application_timeline (
    event_id        UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    app_id          UUID NOT NULL REFERENCES passport_applications(app_id),
    stage           application_stage NOT NULL,
    status          VARCHAR(50) NOT NULL,
    actor_id        UUID,
    actor_role      user_role,
    metadata_json   JSONB,
    created_at      TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE INDEX idx_timeline_app ON application_timeline(app_id);
CREATE INDEX idx_timeline_created ON application_timeline(created_at);
