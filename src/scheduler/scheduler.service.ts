import { Injectable } from '@nestjs/common';
import { SchedulerRegistry } from '@nestjs/schedule';
import { CronJob } from 'cron';

@Injectable()
export class SchedulerService {
  constructor(private schedulerRegistry: SchedulerRegistry) {}

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

  public unscheduleJob(name: string) {
    this.schedulerRegistry.deleteCronJob(name);
  }
}
