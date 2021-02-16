SET search_path TO imgw;

CREATE TABLE temporary_file (
    id SERIAL PRIMARY KEY,
    created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT NOW(),
    request_id BIGINT NOT NULL UNIQUE REFERENCES request (id),
    data BYTEA NOT NULL
);

CREATE TRIGGER set_temporary_file_updated_at
BEFORE UPDATE ON temporary_file
FOR EACH ROW
EXECUTE PROCEDURE trigger_set_updated_at();