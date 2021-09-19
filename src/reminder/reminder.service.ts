import { Injectable, Logger } from '@nestjs/common';
import { RoutineService } from 'src/routine/routine.service';
import { SchedulerService } from 'src/scheduler/scheduler.service';
import { UserService } from 'src/user/user.service';

@Injectable()
export class ReminderService {
  //send reminder immediately
  constructor(
    private schedulerService: SchedulerService,
    private routineService: RoutineService,
    private userService: UserService,
  ) {}
  async sendReminder(userId: number, content: string) {
    const user = await this.userService.user({ id: userId });
    Logger.log(
      `
      A reminder should be send now: ${new Date(Date.now()).toDateString()}
      Reminder's content: ${content}
      To: ${user.email}
      `,
    );
  }
  async scheduleDailyReminder(userId: number, routineId: number) {
    const user = await this.userService.user({ id: userId });
    let routine = await this.routineService.routine({ id: routineId });
    //todo: change to real interval
    if (!routine.reminderString) {
      Logger.log('Changing reminder string');
      routine = await this.routineService.updateRoutine({
        where: { id: routine.id },
        data: {
          reminderString: this.schedulerService.getCronString(
            '*',
            '*',
            '*',
            '*',
            '*',
          ),
        },
      });
      Logger.log(`After changing cron string: ${JSON.stringify(routine)}`);
    }
    Logger.log(`Reminder cron string: ${routine.reminderString}`);
    this.schedulerService.scheduleJob(
      `Daily Reminder - routine ${routine.title} for user ${user.email}`,
      routine.reminderString,
      () => {
        return this.sendReminder(
          userId,
          `Remember about your habit - ${routine.title}`,
        );
      },
    );
  }

  //method called after every restart. Loads all reminders from DB and starts sending them at proper time
  async scheduleAllRemindersFromDatabase() {}
}
