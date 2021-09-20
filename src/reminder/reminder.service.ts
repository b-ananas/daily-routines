import {
  Injectable,
  InternalServerErrorException,
  Logger,
  OnApplicationBootstrap,
} from '@nestjs/common';
import { Routine } from '@prisma/client';
import { RoutineService } from 'src/routine/routine.service';
import { SchedulerService } from 'src/scheduler/scheduler.service';
import { UserService } from 'src/user/user.service';

@Injectable()
export class ReminderService implements OnApplicationBootstrap {
  constructor(
    private schedulerService: SchedulerService,
    private routineService: RoutineService,
    private userService: UserService,
  ) {}
  onApplicationBootstrap() {
    this.scheduleAllRemindersFromDatabase();
  }

  //send reminder immediately
  async sendReminder(userId: number, content: string) {
    //todo: replace with sending reminder logic
    const user = await this.userService.user({ id: userId });
    Logger.log(
      `
      A reminder should be send now: ${new Date(Date.now()).toDateString()}
      Reminder's content: ${content}
      To: ${user.email}
      `,
    );
  }
  async scheduleReminder(
    userId: number,
    routineId: number,
    cronString: string,
  ) {
    let routine = await this.routineService.routine({ id: routineId });
    if (!routine.reminderString) {
      routine = await this.routineService.updateRoutine({
        where: { id: routine.id },
        data: {
          reminderString: cronString,
        },
      });
    }
    this.addReminderToCron(routine);
  }
  async scheduleDailyReminder(
    userId: number,
    routineId: number,
    hour = 9,
    minute = 0,
  ) {
    if (hour < 0 || hour > 23 || minute < 0 || minute > 59) {
      throw new InternalServerErrorException(
        'Time',
        `There is no such hour: ${hour}:${minute}`,
      );
    }
    const cronString = this.schedulerService.getCronString(
      minute.toString(),
      hour.toString(),
      '*',
      '*',
      '*',
    );
    this.scheduleReminder(userId, routineId, cronString);
  }
  async scheduleWeeklyRoutine(
    userId: number,
    routineId: number,
    dayOfWeek = 1, //monday
    hour = 9,
    minute = 0,
  ) {
    if (hour < 0 || hour > 23 || minute < 0 || minute > 59) {
      throw new InternalServerErrorException(
        'Time',
        `There is no such hour: ${hour}:${minute}`,
      );
    }

    if (dayOfWeek < 0 || dayOfWeek > 6) {
      throw new InternalServerErrorException(
        'Time',
        `Day of week should be between 0 (sunday) and 6 (saturday). Received value: ${dayOfWeek}`,
      );
    }

    const cronString = this.schedulerService.getCronString(
      minute.toString(),
      hour.toString(),
      '*',
      '*',
      dayOfWeek.toString(),
    );
    this.scheduleReminder(userId, routineId, cronString);
  }

  async scheduleMonthlyRoutine(
    userId: number,
    routineId: number,
    dayOfMonth = 1,
    hour = 9,
    minute = 0,
  ) {
    if (hour < 0 || hour > 23 || minute < 0 || minute > 59) {
      throw new InternalServerErrorException(
        'Time',
        `There is no such hour: ${hour}:${minute}`,
      );
    }

    if (dayOfMonth < 1 || dayOfMonth > 31) {
      throw new InternalServerErrorException(
        'Time',
        `Day of month should be between 1 and 31. Received value: ${dayOfMonth}`,
      );
    }

    const cronString = this.schedulerService.getCronString(
      minute.toString(),
      hour.toString(),
      dayOfMonth.toString(),
      '*',
      '*',
    );
    this.scheduleReminder(userId, routineId, cronString);
  }

  //method called at app startup
  // Loads all reminders from DB and starts sending them at proper time
  // it may stop the entire app for a few minutes - maybe move this logic to a lambda?
  async scheduleAllRemindersFromDatabase() {
    const allRoutines = await this.routineService.routines({
      where: {
        reminderString: {
          not: null,
        },
      },
    });
    allRoutines.forEach((routine) => {
      this.addReminderToCron(routine);
    });
  }

  private addReminderToCron(routine: Routine) {
    try {
      this.schedulerService.scheduleJob(
        `Daily Reminder - routine ${routine.title} for user ${routine.ownerId}`,
        routine.reminderString,
        () => {
          return this.sendReminder(
            routine.ownerId,
            `Remember about your habit - ${routine.title}`,
          );
        },
      );
    } catch (error) {
      Logger.warn(
        `Error occures while trying to add reminder for routine ${routine.id} to cron
        ${error}`,
      );
      return;
    }
    Logger.log(
      `Successfully added reminder for routine ${routine.title} of user ${routine.ownerId} to cron`,
    );
  }
}
