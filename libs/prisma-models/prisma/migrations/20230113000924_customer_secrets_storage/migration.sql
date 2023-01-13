-- CreateTable
CREATE TABLE "secrets" (
    "id" TEXT NOT NULL,
    "tenant_id" TEXT NOT NULL,
    "key" TEXT NOT NULL,
    "value" TEXT NOT NULL,
    "iv" TEXT NOT NULL,
    "customer_id" TEXT,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "secrets_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE INDEX "secrets_tenant_id_customer_id_idx" ON "secrets"("tenant_id", "customer_id");

-- CreateIndex
CREATE UNIQUE INDEX "secrets_id_tenant_id_key" ON "secrets"("id", "tenant_id");

-- AddForeignKey
ALTER TABLE "secrets" ADD CONSTRAINT "secrets_customer_id_fkey" FOREIGN KEY ("customer_id") REFERENCES "customers"("id") ON DELETE SET NULL ON UPDATE CASCADE;
