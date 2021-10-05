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
} from '@nestjs/common';
import { RoutineService } from './routine.service';

import {
  Routine as RoutineModel,
  Activity as ActivityModel,
  RoutineType,
} from '@prisma/client';
import { JwtAuthGuard } from '../auth/jwt.guard';
import { RoutineGuard } from './routine.guard';
import { ReminderService } from 'src/reminder/reminder.service';
import { RoutineInstanceService } from 'src/routine-instance/routine-instance.service';

@UseGuards(JwtAuthGuard) //sets req.user
@Controller('routine')
export class RoutineController {
  constructor(
    private routineService: RoutineService,
    private routineInstanceService: RoutineInstanceService,
    private reminderService: ReminderService,
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
      type: string;
      dayOfMonth?: number;
      dayOfWeek?: number;
      hour?: number;
      minute?: number;
      month?: number;
    },
  ) {
    const { title, desc, authorEmail, activities } = routineData;
    const type = RoutineType[routineData.type.toUpperCase()];

    const routine = await this.routineService.createRoutine({
      title,
      desc,
      owner: {
        connect: { email: authorEmail },
      },
      activities: {
        create: activities,
      },
      type,
    });
    switch (type) {
      case RoutineType.DAILY:
        await this.reminderService.scheduleDailyReminder(
          routine.ownerId,
          routine.id,
          routineData.hour,
          routineData.minute,
        );
        break;
      case RoutineType.WEEKLY:
        await this.reminderService.scheduleWeeklyRoutine(
          routine.ownerId,
          routine.id,
          routineData.dayOfWeek,
          routineData.hour,
          routineData.minute,
        );
        break;
      case RoutineType.MONTHLY:
        await this.reminderService.scheduleMonthlyRoutine(
          routine.ownerId,
          routine.id,
          routineData.dayOfMonth,
          routineData.hour,
          routineData.minute,
        );
        break;
      case RoutineType.CUSTOM:
        /* eslint-disable */
        await this.reminderService.scheduleReminder(
          routine.id,
          [

            routineData.minute == undefined? '*' : routineData.minute.toString(),
            routineData.hour == undefined? '*' : routineData.hour.toString(),
            routineData.dayOfMonth == undefined? '*' : routineData.dayOfMonth.toString(),
            routineData.month == undefined? '*' : routineData.month.toString(),
            routineData.dayOfWeek == undefined? '*' : routineData.dayOfWeek.toString(),
          ].reduce((prev, curr) => (prev += ' ' + curr)),

        );
        /* eslint-enable */
        break;
    }

    return routine;
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
  @Get('/:id/success-rate') //checked
  async getRoutineSuccessRatesById(@Param('id') id: string) {
    return this.routineInstanceService.getRoutineSuccessRate({
      id: Number(id),
    });
  }

  @UseGuards(RoutineGuard)
  @Get('/:id/instances') //checked
  async getRoutineInstances(@Param('id') id: string) {
    return this.routineInstanceService.getRoutineInstances(Number(id), 'asc');
  }
  // @UseGuards(RoutineGuard)
  // @Get('/instance/:id') //checked
  // async getRoutineInstance(@Param('id') id: string) {
  //   return this.routineInstanceService.getRoutineInstance(Number(id));
  // }

  //todo: this endpoint has little sense. Make it update routine, not just activate it
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
    this.reminderService.removeReminderFromCron(
      await this.routineService.routine({ id: Number(id) }),
    );
    return this.routineService.deleteRoutine({ id: Number(id) });
  }
}
