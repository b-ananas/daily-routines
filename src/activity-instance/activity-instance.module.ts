import { Module } from '@nestjs/common';
import { PrismaService } from 'src/prisma.service';
import { RoutineService } from 'src/routine/routine.service';
import { ActivityInstanceController } from './activity-instance.controller';

@Module({
  providers: [RoutineService, PrismaService],
  controllers: [ActivityInstanceController],
})
export class ActivityInstanceModule {}
