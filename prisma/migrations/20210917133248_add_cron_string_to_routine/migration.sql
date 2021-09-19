-- CreateEnum
CREATE TYPE "RoutineType" AS ENUM ('DAILY', 'WEEKLY', 'MONTHLY', 'INACTIVE', 'CUSTOM');

-- AlterTable
ALTER TABLE "Routine" ADD COLUMN     "reminderString" TEXT,
ADD COLUMN     "type" "RoutineType" NOT NULL DEFAULT E'INACTIVE';
