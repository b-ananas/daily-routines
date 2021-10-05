import { forwardRef, Module } from '@nestjs/common';
import { ReminderModule } from 'src/reminder/reminder.module';
import { RoutineInstanceService } from 'src/routine-instance/routine-instance.service';
import { PrismaService } from '../prisma.service';
import { UserService } from '../user/user.service';
import { RoutineController } from './routine.controller';
import { RoutineService } from './routine.service';

@Module({
  imports: [forwardRef(() => ReminderModule)],
  controllers: [RoutineController],
  providers: [
    RoutineService,
    PrismaService,
    UserService,
    RoutineInstanceService,
  ],
  exports: [RoutineService],
})
export class RoutineModule {}
