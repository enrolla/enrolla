-- CreateTable
CREATE TABLE "packages" (
    "id" TEXT NOT NULL,
    "tenant_id" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "description" TEXT,
    "version" TEXT NOT NULL,
    "parent_package_id" TEXT,
    "parent_package_version" TEXT,
    "applied_features" JSONB NOT NULL,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "packages_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE INDEX "packages_tenant_id_idx" ON "packages"("tenant_id");

-- CreateIndex
CREATE UNIQUE INDEX "packages_id_tenant_id_key" ON "packages"("id", "tenant_id");

-- CreateIndex
CREATE UNIQUE INDEX "packages_tenant_id_name_version_key" ON "packages"("tenant_id", "name", "version" DESC);

-- AddForeignKey
ALTER TABLE "packages" ADD CONSTRAINT "packages_tenant_id_parent_package_id_parent_package_versio_fkey" FOREIGN KEY ("tenant_id", "parent_package_id", "parent_package_version") REFERENCES "packages"("tenant_id", "name", "version") ON DELETE RESTRICT ON UPDATE CASCADE;
