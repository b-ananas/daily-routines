import { Controller, Get } from '@nestjs/common';

@Controller('') //path in routes.ts
export class RoutineInstanceController {
  @Get()
  indexRoutineInstances() {
    return 'TEST: RoutineInstanceController';
  }
}
