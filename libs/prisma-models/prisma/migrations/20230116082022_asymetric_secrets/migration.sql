/*
  Warnings:

  - You are about to drop the column `iv` on the `secrets` table. All the data in the column will be lost.

*/
-- AlterTable
ALTER TABLE "secrets" DROP COLUMN "iv";

-- CreateTable
CREATE TABLE "secret_keys" (
    "id" TEXT NOT NULL,
    "tenant_id" TEXT NOT NULL,
    "key" TEXT NOT NULL,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "secret_keys_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "encryption_keys" (
    "id" TEXT NOT NULL,
    "tenant_id" TEXT NOT NULL,
    "private_key" TEXT NOT NULL,
    "public_key" TEXT NOT NULL,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "encryption_keys_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "secret_keys_id_tenant_id_key" ON "secret_keys"("id", "tenant_id");

-- CreateIndex
CREATE UNIQUE INDEX "secret_keys_key_key" ON "secret_keys"("key");

-- CreateIndex
CREATE UNIQUE INDEX "encryption_keys_id_tenant_id_key" ON "encryption_keys"("id", "tenant_id");

-- CreateIndex
CREATE UNIQUE INDEX "encryption_keys_tenant_id_key" ON "encryption_keys"("tenant_id");
