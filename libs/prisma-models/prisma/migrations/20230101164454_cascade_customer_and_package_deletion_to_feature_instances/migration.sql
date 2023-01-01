-- DropForeignKey
ALTER TABLE "customer_features" DROP CONSTRAINT "customer_features_package_id_fkey";

-- DropForeignKey
ALTER TABLE "package_features" DROP CONSTRAINT "package_features_package_id_fkey";

-- AddForeignKey
ALTER TABLE "package_features" ADD CONSTRAINT "package_features_package_id_fkey" FOREIGN KEY ("package_id") REFERENCES "packages"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "customer_features" ADD CONSTRAINT "customer_features_package_id_fkey" FOREIGN KEY ("package_id") REFERENCES "customers"("id") ON DELETE CASCADE ON UPDATE CASCADE;
