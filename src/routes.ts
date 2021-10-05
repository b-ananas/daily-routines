import { Routes } from 'nest-router';
import { ActivityInstanceModule } from './activity-instance/activity-instance.module';
import { ActivityModule } from './activity/activity.module';
import { RoutineInstanceModule } from './routine-instance/routine-instance.module';
import { RoutineModule } from './routine/routine.module';
import { UserModule } from './user/user.module';

export const routes: Routes = [
  {
    path: '/api/v1',
    children: [
      {
        path: '/routines',
        module: RoutineModule,
        children: [
          {
            path: '/:routineId/activities',
            module: ActivityModule,
          },
          {
            path: '/:routineId/instances',
            module: RoutineInstanceModule,
            children: [
              {
                path: '/:instanceId/activity/',
                module: ActivityInstanceModule,
              },
            ],
          },
        ],
      },
      {
        path: 'users',
        module: UserModule,
      },
    ],
  },
];
