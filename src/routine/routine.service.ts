import { Injectable, Logger } from '@nestjs/common';
import { PrismaService } from '../prisma.service';
import { Routine, Activity, Prisma } from '@prisma/client';

@Injectable()
export class RoutineService {
  constructor(private prisma: PrismaService) {}

  async routine(
    routineWhereUniqueInput: Prisma.RoutineWhereUniqueInput,
  ): Promise<Routine | null> {
    return this.prisma.routine.findUnique({
      where: routineWhereUniqueInput,

      include: {
        activities: true,
      },
    });
  }

  async routineActivities(
    routineWhereUniqueInput: Prisma.RoutineWhereUniqueInput,
  ): Promise<Activity[] | null> {
    const answ = this.prisma.activity.findMany({
      where: {
        routineId: (await this.routine(routineWhereUniqueInput)).id,
      },
    });
    return answ;
  }
  async routines(params: {
    skip?: number;
    take?: number;
    cursor?: Prisma.RoutineWhereUniqueInput;
    where?: Prisma.RoutineWhereInput;
    orderBy?: any;
  }): Promise<Routine[]> {
    const { skip, take, cursor, where, orderBy } = params;
    return this.prisma.routine.findMany({
      include: {
        activities: true,
      },
      skip,
      take,
      cursor,
      where,
      orderBy,
    });
  }

  async createRoutine(data: Prisma.RoutineCreateInput): Promise<Routine> {
    return this.prisma.routine.create({
      data,
    });
  }

  async updateRoutine(params: {
    where: Prisma.RoutineWhereUniqueInput;
    data: Prisma.RoutineUpdateInput;
  }): Promise<Routine> {
    const { data, where } = params;
    return this.prisma.routine.update({
      data,
      where,
    });
  }

  async deleteRoutine(where: Prisma.RoutineWhereUniqueInput): Promise<Routine> {
    return this.prisma.routine.delete({
      where,
    });
  }
}
