import { Test, TestingModule } from '@nestjs/testing';
import { RoutineService } from './routine.service';
import { PrismaService } from '../prisma.service';
import { UserModule } from '../user/user.module';
import { AuthModule } from '../auth/auth.module';
import { RoutineController } from './routine.controller';
import { UserService } from '../user/user.service';
import { Prisma, User } from '@prisma/client';
import * as __ from 'lodash';

describe('RoutineService', () => {
  let service: RoutineService;
  let userService: UserService;
  let user: User;

  //todo: mock prisma
  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      imports: [AuthModule, UserModule],
      controllers: [RoutineController],
      providers: [RoutineService, PrismaService],
    }).compile();

    service = module.get<RoutineService>(RoutineService);
    userService = module.get<UserService>(UserService);

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

  it('should create new routine', async () => {
    const routineData = {
      title: 'test routine',
      authorEmail: 'test@email.com',
    };

    const { title, authorEmail } = routineData;
    await service.createRoutine({
      title,
      owner: {
        connect: { email: authorEmail },
      },
    });
    const numberOfRoutinesAfter = (
      await service.routines({
        where: { ownerId: user.id },
      })
    ).length;
    expect(numberOfRoutinesAfter).toEqual(1);
  });

  it('should create routine with activities', async () => {
    const routineData = {
      title: 'test routine',
      authorEmail: 'test@email.com',
      activitiesData: [
        { content: 'wake up' },
        { content: 'clean' },
        { content: 'drink coffe' },
      ],
    };

    const { title, authorEmail, activitiesData } = routineData;
    const routine = await service.createRoutine({
      title,
      owner: {
        connect: { email: authorEmail },
      },
      activities: {
        create: activitiesData,
      },
    });

    const activities = await service.routineActivities({ id: routine.id });

    expect(__.isArray(activities)).toBeTruthy();
    expect(activities.length).toEqual(3);
  });

  it('should update routine', async () => {
    const routineData = {
      title: 'test routine',
      authorEmail: 'test@email.com',
    };

    const { title, authorEmail } = routineData;
    const routine = await service.createRoutine({
      title,
      owner: {
        connect: { email: authorEmail },
      },
    });

    service.updateRoutine({
      where: { id: routine.id },
      data: { title: 'morning routine' },
    });

    const routineAfter = await service.routine({ id: routine.id });
    expect(routineAfter.title).toEqual('morning routine');
  });

  it('should delete routine', async () => {
    const routineData = {
      title: 'test routine',
      authorEmail: 'test@email.com',
    };

    const { title, authorEmail } = routineData;
    const routine = await service.createRoutine({
      title,
      owner: {
        connect: { email: authorEmail },
      },
    });

    await service.deleteRoutine({ id: routine.id });
    expect(await service.routine({ id: routine.id })).toBeNull();
  });

  it('should retrieve many routines', async () => {
    const authorEmail = 'test@email.com';
    await service.createRoutine({
      title: 'first',
      owner: {
        connect: { email: user.email },
      },
    });
    await service.createRoutine({
      title: 'second',
      owner: {
        connect: { email: user.email },
      },
    });
    await service.createRoutine({
      title: 'third',
      owner: {
        connect: { email: user.email },
      },
    });
    const routinesFromDB = await service.routines({
      where: { ownerId: user.id },
    });
    expect(__.isArray(routinesFromDB)).toBeTruthy();
    expect(routinesFromDB.length).toEqual(3);
  });
});
