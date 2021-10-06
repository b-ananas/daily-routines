import { Module } from '@nestjs/common';
import { PrismaService } from 'src/prisma.service';
import { RoutineService } from 'src/routine/routine.service';
import { ActivityController } from './activity.controller';

@Module({
  providers: [RoutineService, PrismaService],
  controllers: [ActivityController],
})
export class ActivityModule {}
