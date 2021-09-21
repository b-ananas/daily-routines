import { forwardRef, Module } from '@nestjs/common';
import { RoutineModule } from 'src/routine/routine.module';
import { SchedulerModule } from 'src/scheduler/scheduler.module';
import { UserModule } from 'src/user/user.module';
import { ReminderService } from './reminder.service';

@Module({
  imports: [SchedulerModule, forwardRef(() => RoutineModule), UserModule],
  providers: [ReminderService],
  exports: [ReminderService],
})
export class ReminderModule {}
