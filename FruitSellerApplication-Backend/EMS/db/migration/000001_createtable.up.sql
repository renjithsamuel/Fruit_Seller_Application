BEGIN;

CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

CREATE TABLE IF NOT EXISTS "event_table" (
    "eventID" UUID DEFAULT uuid_generate_v4() NOT NULL PRIMARY KEY,
    "topic" TEXT NOT NULL,
    "payload" JSONB NOT NULL,
    "appID" TEXT NOT NULL,
    "retiredAt" TIMESTAMP(3),
    "createdAtUTC" TIMESTAMP(3) NOT NULL DEFAULT NOW(),
    "updatedAtUTC" TIMESTAMP(3) DEFAULT NOW()
);

COMMIT;
