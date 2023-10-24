BEGIN;

CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

CREATE TABLE IF NOT EXISTS "users" (
    "userID" UUID DEFAULT uuid_generate_v4() NOT NULL PRIMARY KEY,
    "name" VARCHAR(50) NOT NULL,
    "dateOfBirth" DATE NOT NULL,
    "role" VARCHAR(10) NOT NULL,
    "email" VARCHAR(64) NOT NULL UNIQUE,
    "phoneNumber" VARCHAR(100),
    "password" VARCHAR(100) NOT NULL,
    "preferredLanguage" VARCHAR(20) NOT NULL,
    "address" VARCHAR(100) NOT NULL,
    "country" VARCHAR(50) NOT NULL,
    "cartID" UUID DEFAULT uuid_generate_v4() NOT NULL UNIQUE,
    "createdAtUTC" TIMESTAMP(3) NOT NULL DEFAULT NOW(),
    "updatedAtUTC" TIMESTAMP(3) DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS "event_table" (
    "eventID" UUID DEFAULT uuid_generate_v4() NOT NULL PRIMARY KEY,
    "topic" TEXT NOT NULL,
    "payload" JSONB NOT NULL,
    "appID" TEXT NOT NULL,
    "createdAtUTC" TIMESTAMP(3) NOT NULL DEFAULT NOW(),
    "updatedAtUTC" TIMESTAMP(3) DEFAULT NOW()
);


COMMIT;