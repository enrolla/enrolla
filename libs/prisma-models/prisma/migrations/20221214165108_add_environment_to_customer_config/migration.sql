-- CreateEnum
CREATE TYPE "Environment" AS ENUM ('DEV', 'STAGING', 'PRODUCTION');

-- AlterTable
ALTER TABLE "customers" ADD COLUMN     "environment" "Environment" NOT NULL DEFAULT 'STAGING';
