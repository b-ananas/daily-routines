import { Controller, Get, Param, UseGuards } from '@nestjs/common';
import { Activity } from '@prisma/client';
import { JwtAuthGuard } from 'src/auth/jwt.guard';
import { RoutineInstanceService } from 'src/routine-instance/routine-instance.service';
import { RoutineGuard } from 'src/routine/routine.guard';
import { RoutineService } from 'src/routine/routine.service';

// @UseGuards(JwtAuthGuard) //sets req.user
@Controller('') //path in routes.ts
export class ActivityController {
  constructor(private routineService: RoutineService) {}
  // private routineInstanceService: RoutineInstanceService,
  // @Get()
  // indexActivities() {
  //   return 'TEST: activityController';
  // }
  // @UseGuards(RoutineGuard)
  @Get('/') //todo: check
  async getRoutineActivitiesById(
    @Param('routineId') id: string,
  ): Promise<Activity[]> {
    return this.routineService.routineActivities({ id: Number(id) });
  }
}
