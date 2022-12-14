/*
  Warnings:

  - You are about to drop the `github_organizations` table. If the table is not empty, all the data it contains will be lost.

*/
-- DropTable
DROP TABLE "github_organizations";

-- CreateTable
CREATE TABLE "github_installations" (
    "id" INTEGER NOT NULL,
    "tenant_id" TEXT NOT NULL
);

-- CreateIndex
CREATE UNIQUE INDEX "github_installations_id_key" ON "github_installations"("id");

-- CreateIndex
CREATE UNIQUE INDEX "github_installations_tenant_id_key" ON "github_installations"("tenant_id");
