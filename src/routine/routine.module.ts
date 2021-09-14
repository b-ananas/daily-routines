import { Module } from '@nestjs/common';
import { PrismaService } from '../prisma.service';
import { UserService } from '../user/user.service';
import { RoutineController } from './routine.controller';
import { RoutineService } from './routine.service';

@Module({
  controllers: [RoutineController],
  providers: [RoutineService, PrismaService, UserService],
})
export class RoutineModule {}
