import { Module } from '@nestjs/common';
import { ActivityInstanceController } from './activity-instance.controller';

@Module({
  controllers: [ActivityInstanceController]
})
export class ActivityInstanceModule {}
