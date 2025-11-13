-- migrate:up
CREATE TABLE sessions (
  sid TEXT PRIMARY KEY,
  sess JSONB NOT NULL,
  expire TIMESTAMPTZ(6) NOT NULL
);

CREATE INDEX idx_session_expire ON sessions (expire);

-- migrate:down
DROP TABLE sessions;
