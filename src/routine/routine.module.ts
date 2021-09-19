import { forwardRef, Module } from '@nestjs/common';
import { ReminderModule } from 'src/reminder/reminder.module';
import { PrismaService } from '../prisma.service';
import { UserService } from '../user/user.service';
import { RoutineController } from './routine.controller';
import { RoutineService } from './routine.service';

@Module({
  imports: [forwardRef(() => ReminderModule)],
  controllers: [RoutineController],
  providers: [RoutineService, PrismaService, UserService],
  exports: [RoutineService],
})
export class RoutineModule {}
