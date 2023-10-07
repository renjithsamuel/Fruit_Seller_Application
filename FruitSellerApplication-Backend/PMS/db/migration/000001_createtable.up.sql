BEGIN;

CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

CREATE TABLE IF NOT EXISTS "products" (
    "productID" UUID DEFAULT uuid_generate_v4() NOT NULL PRIMARY KEY,
    "productName" VARCHAR(255) NOT NULL,
    "description" TEXT,
    "price" DECIMAL(10, 2) NOT NULL,
    "stockQuantity" INT NOT NULL,
    "sellerID" UUID NOT NULL,
    "imageUrl" TEXT NOT NULL,
    "category" TEXT NOT NULL,
    "createdAtUTC" TIMESTAMP(3) NOT NULL DEFAULT NOW(),
    "updatedAtUTC" TIMESTAMP(3) DEFAULT NOW()
);

COMMIT;
