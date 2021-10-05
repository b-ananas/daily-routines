import { Controller, Get } from '@nestjs/common';

@Controller('') //path in routes.ts
export class ActivityInstanceController {
  @Get()
  indexActivityInstances() {
    return 'TEST: activityInstanceController';
  }
}
