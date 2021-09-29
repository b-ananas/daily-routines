import { Test, TestingModule } from '@nestjs/testing';
import { Activity, Prisma, Routine, RoutineType, User } from '@prisma/client';
import _ from 'lodash';
import { PrismaService } from 'src/prisma.service';
import { RoutineService } from 'src/routine/routine.service';
import { UserService } from 'src/user/user.service';
import { RoutineInstanceService } from './routine-instance.service';

describe('RoutineInstanceService', () => {
  let service: RoutineInstanceService;

  let user: User;
  let userService: UserService;
  let routineService: RoutineService;
  let routine: Routine & { activities: Activity[] };
  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        RoutineInstanceService,
        PrismaService,
        UserService,
        RoutineService,
      ],
    }).compile();

    service = module.get<RoutineInstanceService>(RoutineInstanceService);
    userService = module.get<UserService>(UserService);
    routineService = module.get<RoutineService>(RoutineService);

    const userData = {
      name: 'test',
      email: 'test@email.com',
      password: 'password1234',
    };
    //deletes test user WITH all his routines
    if (await userService.user({ email: 'test@email.com' })) {
      await userService.deleteUser({ email: 'test@email.com' });
    }
    user = await userService.createUser(userData);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  it('should create instance of a routine', async () => {
    //routine is deleted before running the tests, so it is safe not to delete it here
    routine = (await routineService.createRoutine({
      title: 'test',
      owner: {
        connect: {
          id: user.id,
        },
      },
      activities: {
        create: [
          { content: 'test activity 1' },
          { content: 'test activity 2' },
          { content: 'test activity 3' },
          { content: 'test activity 4' },
        ],
      },
    })) as any;
    routine.activities = await routineService.routineActivities({
      id: routine.id,
    });

    await service.create(
      routine,
      new Date('Sept 23, 2021'),
      new Date('Sept 24, 2021'),
    );
    const routineInstance = (await service.getRoutineInstances(routine.id))[0];
    expect(routineInstance).not.toBeNull();
    expect(routineInstance.activityInstances.length).toEqual(4);
  });

  it('should return data about success rate', async () => {
    routine = (await routineService.createRoutine({
      title: 'test',
      owner: {
        connect: {
          id: user.id,
        },
      },
    })) as any;
    routine.activities = await routineService.routineActivities({
      id: routine.id,
    });

    const instances = [
      await service.create(
        routine,
        new Date('Sept 19, 2021'),
        new Date('Sept 20, 2021'),
      ),
      await service.create(
        routine,
        new Date('Sept 20, 2021'),
        new Date('Sept 21, 2021'),
      ),
      await service.create(
        routine,
        new Date('Sept 21, 2021'),
        new Date('Sept 22, 2021'),
      ),
      await service.create(
        routine,
        new Date('Sept 22, 2021'),
        new Date('Sept 23, 2021'),
      ),
      await service.create(
        routine,
        new Date('Sept 23, 2021'),
        new Date('Sept 24, 2021'),
      ),
    ];
    expect(await service.getSuccessRate({ id: routine.id })).toEqual(0);
    await service.completeRoutine(instances[0].id);
    expect(await service.getSuccessRate({ id: routine.id })).toEqual(
      1 / instances.length,
    );
    await service.completeRoutine(instances[1].id);
    await service.completeRoutine(instances[2].id);
    expect(await service.getSuccessRate({ id: routine.id })).toEqual(
      3 / instances.length,
    );
  });

  it('sort returned instances', async () => {
    routine = (await routineService.createRoutine({
      title: 'test',
      owner: {
        connect: {
          id: user.id,
        },
      },
    })) as any;
    routine.activities = await routineService.routineActivities({
      id: routine.id,
    });

    const instances = [
      await service.create(
        routine,
        new Date('Sept 21, 2021'),
        new Date('Sept 22, 2021'),
      ),
      await service.create(
        routine,
        new Date('Sept 19, 2021'),
        new Date('Sept 20, 2021'),
      ),
      await service.create(
        routine,
        new Date('Sept 23, 2021'),
        new Date('Sept 24, 2021'),
      ),
      await service.create(
        routine,
        new Date('Sept 20, 2021'),
        new Date('Sept 21, 2021'),
      ),
      await service.create(
        routine,
        new Date('Sept 22, 2021'),
        new Date('Sept 23, 2021'),
      ),
    ];
    const returnValue = (
      await service.getRoutineInstances(routine.id, 'asc')
    ).map((inst) => {
      return inst.start;
    });
    const expectedValue = instances
      .map((inst) => {
        return inst.start;
      })
      .sort((date1, date2) => date1.getTime() - date2.getTime());
    expect(returnValue).toEqual(expectedValue);
  });
});
