/*
  Warnings:

  - You are about to drop the column `activiteId` on the `ActivityInstance` table. All the data in the column will be lost.
  - Added the required column `activityId` to the `ActivityInstance` table without a default value. This is not possible if the table is not empty.

*/
-- DropForeignKey
ALTER TABLE "ActivityInstance" DROP CONSTRAINT "ActivityInstance_activiteId_fkey";

-- AlterTable
ALTER TABLE "ActivityInstance" DROP COLUMN "activiteId",
ADD COLUMN     "activityId" INTEGER NOT NULL;

-- AddForeignKey
ALTER TABLE "ActivityInstance" ADD CONSTRAINT "ActivityInstance_activityId_fkey" FOREIGN KEY ("activityId") REFERENCES "Activity"("id") ON DELETE CASCADE ON UPDATE CASCADE;
