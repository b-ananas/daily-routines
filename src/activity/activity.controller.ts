import { Controller, Get } from '@nestjs/common';

@Controller('') //path in routes.ts
export class ActivityController {
  @Get()
  indexActivities() {
    return 'TEST: activityController';
  }
}
