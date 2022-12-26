-- CreateTable
CREATE TABLE "features_instances" (
    "id" TEXT NOT NULL,
    "tenant_id" TEXT NOT NULL,
    "feature_id" TEXT NOT NULL,
    "package_id" TEXT NOT NULL,
    "value" JSONB NOT NULL,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "features_instances_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "packages" (
    "id" TEXT NOT NULL,
    "tenant_id" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "description" TEXT,
    "version" TEXT NOT NULL DEFAULT '1.0.0',
    "parent_package_id" TEXT,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "packages_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "features_instances_id_tenant_id_key" ON "features_instances"("id", "tenant_id");

-- CreateIndex
CREATE INDEX "packages_tenant_id_idx" ON "packages"("tenant_id");

-- CreateIndex
CREATE UNIQUE INDEX "packages_id_tenant_id_key" ON "packages"("id", "tenant_id");

-- CreateIndex
CREATE UNIQUE INDEX "packages_tenant_id_name_version_key" ON "packages"("tenant_id", "name", "version" DESC);

-- AddForeignKey
ALTER TABLE "features_instances" ADD CONSTRAINT "features_instances_feature_id_fkey" FOREIGN KEY ("feature_id") REFERENCES "features"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "features_instances" ADD CONSTRAINT "features_instances_package_id_fkey" FOREIGN KEY ("package_id") REFERENCES "packages"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "packages" ADD CONSTRAINT "packages_parent_package_id_fkey" FOREIGN KEY ("parent_package_id") REFERENCES "packages"("id") ON DELETE SET NULL ON UPDATE CASCADE;
