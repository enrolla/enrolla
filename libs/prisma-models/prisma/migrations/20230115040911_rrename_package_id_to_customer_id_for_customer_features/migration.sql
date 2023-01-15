/*
  Warnings:

  - You are about to drop the column `package_id` on the `customer_features` table. All the data in the column will be lost.
  - Added the required column `customer_id` to the `customer_features` table without a default value. This is not possible if the table is not empty.

*/
-- DropForeignKey
ALTER TABLE "customer_features" DROP CONSTRAINT "customer_features_package_id_fkey";

-- DropIndex
DROP INDEX "customer_features_tenant_id_package_id_idx";

-- AlterTable
ALTER TABLE "customer_features" DROP COLUMN "package_id",
ADD COLUMN     "customer_id" TEXT NOT NULL;

-- CreateIndex
CREATE INDEX "customer_features_tenant_id_customer_id_idx" ON "customer_features"("tenant_id", "customer_id");

-- AddForeignKey
ALTER TABLE "customer_features" ADD CONSTRAINT "customer_features_customer_id_fkey" FOREIGN KEY ("customer_id") REFERENCES "customers"("id") ON DELETE CASCADE ON UPDATE CASCADE;
