import { Module } from '@nestjs/common';
import { PrismaService } from 'src/prisma.service';
import { RoutineInstanceService } from './routine-instance.service';

@Module({
  providers: [RoutineInstanceService, PrismaService],
})
export class RoutineInstanceModule {}
