import { Module } from '@nestjs/common';
import { PrismaService } from 'src/prisma.service';
import { RoutineInstanceService } from './routine-instance.service';
import { RoutineInstanceController } from './routine-instance.controller';

@Module({
  providers: [RoutineInstanceService, PrismaService],
  controllers: [RoutineInstanceController],
  exports: [RoutineInstanceService],
})
export class RoutineInstanceModule {}
