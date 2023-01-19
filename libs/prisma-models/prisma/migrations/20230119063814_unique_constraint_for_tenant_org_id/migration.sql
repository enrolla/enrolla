/*
  Warnings:

  - A unique constraint covering the columns `[tenant_id,organization_id]` on the table `customers` will be added. If there are existing duplicate values, this will fail.

*/
-- CreateIndex
CREATE UNIQUE INDEX "customers_tenant_id_organization_id_key" ON "customers"("tenant_id", "organization_id");
