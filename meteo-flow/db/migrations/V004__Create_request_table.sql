SET search_path TO imgw;

CREATE TABLE request (
    id SERIAL PRIMARY KEY,
    created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT NOW(),
    status imgw.status NOT NULL DEFAULT ('PENDING'),
    attempts INTEGER NOT NULL DEFAULT(0),
    uri TEXT NOT NULL,
    operator TEXT NOT NULL
);

CREATE TRIGGER set_imgw_request_updated_at
BEFORE UPDATE ON request
FOR EACH ROW
EXECUTE PROCEDURE trigger_set_updated_at();