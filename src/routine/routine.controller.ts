import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Post,
  Put,
  UseGuards,
} from '@nestjs/common';
import { UserService } from 'src/user/user.service';
import { RoutineService } from './routine.service';

import {
  Routine as RoutineModel,
  Activity as ActivityModel,
} from '@prisma/client';
import { JwtAuthGuard } from 'src/auth/jwt.guard';

@Controller('routine')
export class RoutineController {
  constructor(
    private readonly userService: UserService,
    private readonly routineService: RoutineService,
  ) {}

  @UseGuards(JwtAuthGuard) //todo: use jwt authorization to search only for routines of current user
  @Get('/all')
  async getActiveRoutines(): Promise<RoutineModel[]> {
    return this.routineService.routines({
      where: { active: true },
    });
  }

  @Post('')
  async createRoutine(
    @Body()
    routineData: {
      title: string;
      desc?: string;
      authorEmail: string;
      activities: { content: string };
    },
  ): Promise<RoutineModel> {
    const { title, desc, authorEmail, activities } = routineData;
    return this.routineService.createRoutine({
      title,
      desc,
      owner: {
        connect: { email: authorEmail },
      },
      activities: {
        create: activities,
      },
    });
  }

  @Get('/:id')
  async getRoutineById(@Param('id') id: string): Promise<RoutineModel> {
    return this.routineService.routine({ id: Number(id) });
  }
  @Get('/:id/activities')
  async getRoutineActivitiesById(
    @Param('id') id: string,
  ): Promise<ActivityModel[]> {
    return this.routineService.routineActivities({ id: Number(id) });
  }
  @Put('/:id')
  async addRoutine(@Param('id') id: string): Promise<RoutineModel> {
    return this.routineService.updateRoutine({
      where: { id: Number(id) },
      data: { active: true },
    });
  }

  @Delete('/:id')
  async deleteRoutine(@Param('id') id: string): Promise<RoutineModel> {
    return this.routineService.deleteRoutine({ id: Number(id) });
  }
}
