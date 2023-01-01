/*
  Warnings:

  - You are about to drop the `features_instances` table. If the table is not empty, all the data it contains will be lost.

*/
-- DropForeignKey
ALTER TABLE "features_instances" DROP CONSTRAINT "features_instances_feature_id_fkey";

-- DropForeignKey
ALTER TABLE "features_instances" DROP CONSTRAINT "features_instances_package_id_fkey";

-- DropTable
DROP TABLE "features_instances";

-- CreateTable
CREATE TABLE "package_features" (
    "id" TEXT NOT NULL,
    "tenant_id" TEXT NOT NULL,
    "feature_id" TEXT NOT NULL,
    "package_id" TEXT NOT NULL,
    "value" JSONB NOT NULL,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "package_features_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "customer_features" (
    "id" TEXT NOT NULL,
    "tenant_id" TEXT NOT NULL,
    "feature_id" TEXT NOT NULL,
    "package_id" TEXT NOT NULL,
    "value" JSONB NOT NULL,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "customer_features_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "customers" (
    "id" TEXT NOT NULL,
    "tenant_id" TEXT NOT NULL,
    "organization_id" TEXT,
    "package_id" TEXT,
    "name" TEXT NOT NULL,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "customers_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE INDEX "package_features_tenant_id_package_id_idx" ON "package_features"("tenant_id", "package_id");

-- CreateIndex
CREATE INDEX "package_features_tenant_id_feature_id_idx" ON "package_features"("tenant_id", "feature_id");

-- CreateIndex
CREATE UNIQUE INDEX "package_features_id_tenant_id_key" ON "package_features"("id", "tenant_id");

-- CreateIndex
CREATE INDEX "customer_features_tenant_id_package_id_idx" ON "customer_features"("tenant_id", "package_id");

-- CreateIndex
CREATE INDEX "customer_features_tenant_id_feature_id_idx" ON "customer_features"("tenant_id", "feature_id");

-- CreateIndex
CREATE UNIQUE INDEX "customer_features_id_tenant_id_key" ON "customer_features"("id", "tenant_id");

-- CreateIndex
CREATE INDEX "customers_tenant_id_idx" ON "customers"("tenant_id");

-- CreateIndex
CREATE UNIQUE INDEX "customers_id_tenant_id_key" ON "customers"("id", "tenant_id");

-- AddForeignKey
ALTER TABLE "package_features" ADD CONSTRAINT "package_features_feature_id_fkey" FOREIGN KEY ("feature_id") REFERENCES "features"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "package_features" ADD CONSTRAINT "package_features_package_id_fkey" FOREIGN KEY ("package_id") REFERENCES "packages"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "customer_features" ADD CONSTRAINT "customer_features_feature_id_fkey" FOREIGN KEY ("feature_id") REFERENCES "features"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "customer_features" ADD CONSTRAINT "customer_features_package_id_fkey" FOREIGN KEY ("package_id") REFERENCES "customers"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "customers" ADD CONSTRAINT "customers_package_id_fkey" FOREIGN KEY ("package_id") REFERENCES "packages"("id") ON DELETE SET NULL ON UPDATE CASCADE;
