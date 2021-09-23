import { Injectable } from '@nestjs/common';
import {
  Activity,
  ActivityInstance,
  Prisma,
  Routine,
  RoutineInstance,
  Status,
} from '@prisma/client';
import { PrismaService } from 'src/prisma.service';

@Injectable()
export class RoutineInstanceService {
  constructor(private prisma: PrismaService) {}

  public async create(
    routine: Routine & { activities: Activity[] },
    start: Date,
    end: Date,
  ) {
    const routineInstance = await this.prisma.routineInstance.create({
      data: {
        routineId: routine.id,
        start,
        end,
        succeded: Status.IN_PROGRESS,
        activityInstances: {
          create: routine.activities.map((activity) => {
            return {
              activityId: activity.id,
              succeded: Status.IN_PROGRESS,
            };
          }),
        },
      },
    });

    // await this.addActivitiesInstances(routineInstance, activities);

    return this.prisma.routineInstance.findFirst({
      where: { id: routineInstance.id },
    });
  }

  public addActivitiesInstances(
    routineInstance: RoutineInstance & {
      activities: Activity[];
    },
  ) {
    const data = routineInstance.activities.map((activity) => {
      return {
        activityId: activity.id,
        succeded: Status.IN_PROGRESS,
        routineInstanceId: routineInstance.id,
      };
    });
    this.prisma.activityInstance.createMany({
      data,
    });
  }
  public getRoutineInstances(routineId: number) {
    return this.prisma.routineInstance.findMany({
      where: { routineId },
      include: { activityInstances: true },
    });
  }

  public completeRoutine(routineInstance: RoutineInstance) {
    this.prisma.routineInstance.update({
      where: { id: routineInstance.id },
      data: { succeded: Status.SUCCEDED },
    });
  }

  public async completeActivity(activityInstance: ActivityInstance) {
    await this.prisma.activityInstance.update({
      where: { id: activityInstance.id },
      data: { succeded: Status.SUCCEDED },
    });
    const routineInstance = await this.prisma.routineInstance.findFirst({
      where: { id: activityInstance.routineInstanceId },
      include: { activityInstances: true },
    });
    if (
      //check if all activities were completed
      routineInstance.activityInstances
        .map((singleActivityInstance) =>
          this.isCompleted(singleActivityInstance),
        )
        .reduce((succeded, nextSucceded) => (succeded &&= nextSucceded))
    ) {
      this.completeRoutine(routineInstance);
    }
  }

  public isCompleted(instance: RoutineInstance | ActivityInstance) {
    return (
      instance.succeded == Status.SUCCEDED ||
      instance.succeded == Status.TEMPORARILY_DISABLED
    );
  }
}
