/*
  Warnings:

  - A unique constraint covering the columns `[key,tenant_id]` on the table `secret_keys` will be added. If there are existing duplicate values, this will fail.

*/
-- DropIndex
DROP INDEX "secret_keys_key_key";

-- CreateIndex
CREATE UNIQUE INDEX "secret_keys_key_tenant_id_key" ON "secret_keys"("key", "tenant_id");
