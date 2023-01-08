-- CreateTable
CREATE TABLE "secrets" (
    "id" TEXT NOT NULL,
    "tenant_id" TEXT NOT NULL,
    "key" TEXT NOT NULL,
    "value" TEXT NOT NULL,
    "random_bytes" TEXT NOT NULL,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "secrets_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE INDEX "secrets_tenant_id_idx" ON "secrets"("tenant_id");

-- CreateIndex
CREATE UNIQUE INDEX "secrets_id_tenant_id_key" ON "secrets"("id", "tenant_id");

-- CreateIndex
CREATE UNIQUE INDEX "secrets_tenant_id_key_key" ON "secrets"("tenant_id", "key");
