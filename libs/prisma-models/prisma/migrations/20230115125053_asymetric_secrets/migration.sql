-- AlterTable
ALTER TABLE "secrets" ADD COLUMN     "is_symmetric" BOOLEAN NOT NULL DEFAULT false,
ALTER COLUMN "iv" DROP NOT NULL;

-- CreateTable
CREATE TABLE "encryption_keys" (
    "id" TEXT NOT NULL,
    "tenant_id" TEXT NOT NULL,
    "private_key" TEXT NOT NULL,
    "public_key" TEXT NOT NULL,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "encryption_keys_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "encryption_keys_id_tenant_id_key" ON "encryption_keys"("id", "tenant_id");

-- CreateIndex
CREATE UNIQUE INDEX "encryption_keys_tenant_id_key" ON "encryption_keys"("tenant_id");
