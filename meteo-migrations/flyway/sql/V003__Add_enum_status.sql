SET search_path TO imgw;

CREATE TYPE imgw.status AS ENUM ('PENDING', 'LOCKED', 'ACTIVE', 'FAILURE', 'COMPLETE');
