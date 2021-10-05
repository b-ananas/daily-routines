-- CreateEnum
CREATE TYPE "Status" AS ENUM ('SUCCEDED', 'IN_PROGRESS', 'FAILED', 'TEMPORARILY_DISABLED');

-- CreateTable
CREATE TABLE "RoutineInstance" (
    "id" SERIAL NOT NULL,
    "routineId" INTEGER NOT NULL,
    "start" TIMESTAMP(3) NOT NULL,
    "end" TIMESTAMP(3) NOT NULL,
    "succeded" "Status" NOT NULL,

    CONSTRAINT "RoutineInstance_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "ActivityInstance" (
    "id" SERIAL NOT NULL,
    "activiteId" INTEGER NOT NULL,
    "routineInstanceId" INTEGER NOT NULL,
    "succeded" "Status" NOT NULL,

    CONSTRAINT "ActivityInstance_pkey" PRIMARY KEY ("id")
);

-- AddForeignKey
ALTER TABLE "RoutineInstance" ADD CONSTRAINT "RoutineInstance_routineId_fkey" FOREIGN KEY ("routineId") REFERENCES "Routine"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "ActivityInstance" ADD CONSTRAINT "ActivityInstance_activiteId_fkey" FOREIGN KEY ("activiteId") REFERENCES "Activity"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "ActivityInstance" ADD CONSTRAINT "ActivityInstance_routineInstanceId_fkey" FOREIGN KEY ("routineInstanceId") REFERENCES "RoutineInstance"("id") ON DELETE CASCADE ON UPDATE CASCADE;
