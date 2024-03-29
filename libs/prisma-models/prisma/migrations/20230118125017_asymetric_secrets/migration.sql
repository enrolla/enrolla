/*
  Warnings:

  - You are about to drop the column `iv` on the `secrets` table. All the data in the column will be lost.
  - A unique constraint covering the columns `[key,customer_id,tenant_id]` on the table `secrets` will be added. If there are existing duplicate values, this will fail.
  - Added the required column `ephem_pub_key` to the `secrets` table without a default value. This is not possible if the table is not empty.
  - Added the required column `nonce` to the `secrets` table without a default value. This is not possible if the table is not empty.
  - Made the column `customer_id` on table `secrets` required. This step will fail if there are existing NULL values in that column.

*/
-- DropForeignKey
ALTER TABLE "secrets" DROP CONSTRAINT "secrets_customer_id_fkey";

-- AlterTable
ALTER TABLE "secrets" DROP COLUMN "iv",
ADD COLUMN     "ephem_pub_key" TEXT NOT NULL,
ADD COLUMN     "nonce" TEXT NOT NULL,
ALTER COLUMN "customer_id" SET NOT NULL;

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

-- CreateIndex
CREATE INDEX "secrets_key_customer_id_tenant_id_idx" ON "secrets"("key", "customer_id", "tenant_id");

-- CreateIndex
CREATE UNIQUE INDEX "secrets_key_customer_id_tenant_id_key" ON "secrets"("key", "customer_id", "tenant_id");

-- AddForeignKey
ALTER TABLE "secrets" ADD CONSTRAINT "secrets_customer_id_fkey" FOREIGN KEY ("customer_id") REFERENCES "customers"("id") ON DELETE CASCADE ON UPDATE CASCADE;
