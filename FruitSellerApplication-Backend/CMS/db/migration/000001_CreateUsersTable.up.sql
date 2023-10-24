CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

CREATE TABLE IF NOT EXISTS "carts" (
    "cartID" UUID NOT NULL PRIMARY KEY,
    "userID" UUID NOT NULL,
    "totalCost" INT NOT NULL DEFAULT 0,
    "createdAtUTC" TIMESTAMP(3) NOT NULL DEFAULT NOW(),
    "updatedAtUTC" TIMESTAMP(3) DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS "cart_items" (
    "cartItemID" UUID DEFAULT uuid_generate_v4() NOT NULL PRIMARY KEY,
    "productID" UUID NOT NULL,
    "quantity" INT NOT NULL,
    "cartID" UUID NOT NULL,
    FOREIGN KEY ("cartID") REFERENCES "carts"("cartID"), 
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
