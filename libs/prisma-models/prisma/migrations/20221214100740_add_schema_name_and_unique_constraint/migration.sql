/*
  Warnings:

  - A unique constraint covering the columns `[tenant_id,name]` on the table `schemas` will be added. If there are existing duplicate values, this will fail.

*/

-- TruncateTable
TRUNCATE TABLE "schemas" CASCADE;

-- AlterTable
ALTER TABLE "schemas" ADD COLUMN     "name" TEXT NOT NULL;

-- CreateIndex
CREATE UNIQUE INDEX "schemas_tenant_id_name_key" ON "schemas"("tenant_id", "name");
