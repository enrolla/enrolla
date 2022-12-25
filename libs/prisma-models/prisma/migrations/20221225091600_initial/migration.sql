-- CreateEnum
CREATE TYPE "feature_type" AS ENUM ('INTEGER', 'FLOAT', 'STRING', 'BOOLEAN', 'JSON');

-- CreateTable
CREATE TABLE "features" (
    "id" TEXT NOT NULL,
    "tenant_id" TEXT NOT NULL,
    "key" TEXT NOT NULL,
    "type" "feature_type" NOT NULL,
    "description" TEXT,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "features_pkey" PRIMARY KEY ("id")
);
