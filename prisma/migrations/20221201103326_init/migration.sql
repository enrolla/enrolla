-- CreateTable
CREATE TABLE "configurations" (
    "id" TEXT NOT NULL,
    "tenant_id" TEXT NOT NULL,
    "customer_id" TEXT NOT NULL,
    "configuration" JSONB NOT NULL,
    "version" INTEGER NOT NULL DEFAULT 1,
    "schema_id" TEXT NOT NULL,
    "schema_tag" TEXT NOT NULL,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "configurations_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "schemas" (
    "id" TEXT NOT NULL,
    "tenant_id" TEXT NOT NULL,
    "schema" JSONB NOT NULL,

    CONSTRAINT "schemas_pkey" PRIMARY KEY ("id")
);

-- AddForeignKey
ALTER TABLE "configurations" ADD CONSTRAINT "configurations_schema_id_fkey" FOREIGN KEY ("schema_id") REFERENCES "schemas"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
