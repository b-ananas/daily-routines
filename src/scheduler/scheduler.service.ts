import { Injectable } from '@nestjs/common';
import { Cron, CronExpression, SchedulerRegistry } from '@nestjs/schedule';
import { CronJob } from 'cron';
import { RoutineService } from 'src/routine/routine.service';

@Injectable()
export class SchedulerService {
  constructor(
    private schedulerRegistry: SchedulerRegistry, // private routineService: RoutineService,
  ) {}

  public getCronString(
    minute: string,
    hour: string,
    dayOfMonth: string,
    month: string,
    dayOfWeek: string,
  ) {
    return `${minute} ${hour} ${dayOfMonth} ${month} ${dayOfWeek}`;
  }

  public scheduleJob(name: string, cronString: string, callback: () => void) {
    const job = new CronJob(cronString, callback);
    this.schedulerRegistry.addCronJob(name, job);
    job.start();
  }
}
