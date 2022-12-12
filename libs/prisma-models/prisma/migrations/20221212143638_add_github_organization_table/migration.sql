-- CreateTable
CREATE TABLE "github_organizations" (
    "id" INTEGER NOT NULL,
    "tenant_id" TEXT NOT NULL
);

-- CreateIndex
CREATE UNIQUE INDEX "github_organizations_id_key" ON "github_organizations"("id");

-- CreateIndex
CREATE UNIQUE INDEX "github_organizations_tenant_id_key" ON "github_organizations"("tenant_id");
