import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Post,
  Put,
  UseGuards,
  Request,
  Logger,
  UnauthorizedException,
  NotFoundException,
} from '@nestjs/common';
import { UserService } from '../user/user.service';
import { RoutineService } from './routine.service';

import {
  Routine as RoutineModel,
  Activity as ActivityModel,
} from '@prisma/client';
import { JwtAuthGuard } from '../auth/jwt.guard';
import { RoutineGuard } from './routine.guard';

@UseGuards(JwtAuthGuard) //sets req.user
@Controller('routine')
export class RoutineController {
  constructor(
    private readonly userService: UserService,
    private readonly routineService: RoutineService,
  ) {}

  @Get('/all')
  async getActiveRoutines(@Request() req): Promise<RoutineModel[]> {
    return this.routineService.routines({
      where: { active: true, ownerId: req.user.userId },
    });
  }

  @Post('') //todo: retrieve author email from jwt
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

  @UseGuards(RoutineGuard)
  @Get('/:id')
  async getRoutineById(
    @Request() req,
    @Param('id') id: string,
  ): Promise<RoutineModel> {
    return this.routineService.routine({
      id: Number(id),
    });
  }

  @UseGuards(RoutineGuard)
  @Get('/:id/activities') //todo: check
  async getRoutineActivitiesById(
    @Param('id') id: string,
  ): Promise<ActivityModel[]> {
    return this.routineService.routineActivities({ id: Number(id) });
  }

  @UseGuards(RoutineGuard)
  @Put('/:id') //todo: check
  async addRoutine(@Param('id') id: string): Promise<RoutineModel> {
    return this.routineService.updateRoutine({
      where: { id: Number(id) },
      data: { active: true },
    });
  }

  @UseGuards(RoutineGuard)
  @Delete('/:id') //todo: check
  async deleteRoutine(@Param('id') id: string): Promise<RoutineModel> {
    return this.routineService.deleteRoutine({ id: Number(id) });
  }
}
