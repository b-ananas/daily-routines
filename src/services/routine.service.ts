import { Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma.service';
import { Routine, Prisma } from '@prisma/client';

@Injectable()
export class RoutineService {
  constructor(private prisma: PrismaService) {}

  async routine(
    routineWhereUniqueInput: Prisma.RoutineWhereUniqueInput,
  ): Promise<Routine | null> {
    return this.prisma.routine.findUnique({
      where: routineWhereUniqueInput,
    });
  }

  async routines(params: {
    skip?: number;
    take?: number;
    cursor?: Prisma.RoutineWhereUniqueInput;
    where?: Prisma.RoutineWhereInput;
    orderBy?: Prisma.RoutineOrderByInput;
  }): Promise<Routine[]> {
    const { skip, take, cursor, where, orderBy } = params;
    return this.prisma.routine.findMany({
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
