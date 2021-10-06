import { Controller, Get, Param, Post, UseGuards } from '@nestjs/common';
import { RoutineInstanceService } from 'src/routine-instance/routine-instance.service';
import { RoutineGuard } from 'src/routine/routine.guard';

//todo: extract routine via pipe
@Controller('') //path in routes.ts
export class RoutineInstanceController {
  constructor(private routineInstanceService: RoutineInstanceService) {}

  // @Get()
  // indexActivityInstances() {
  //   return 'TEST: activityInstanceController';
  // }

  // @UseGuards(RoutineGuard)
  @Get('/')
  async getRoutineInstances(@Param('routineId') id: string) {
    return this.routineInstanceService.getRoutineInstances(Number(id), 'asc');
  }
}
