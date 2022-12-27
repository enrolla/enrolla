-- CreateIndex
CREATE INDEX "features_instances_tenant_id_package_id_idx" ON "features_instances"("tenant_id", "package_id");

-- CreateIndex
CREATE INDEX "features_instances_tenant_id_feature_id_idx" ON "features_instances"("tenant_id", "feature_id");
