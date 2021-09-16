import { forwardRef } from '@nestjs/common';
import { Test, TestingModule } from '@nestjs/testing';
import { AuthModule } from '../auth/auth.module';
import { PrismaService } from '../prisma.service';
import { UserController } from './user.controller';
import { UserService } from './user.service';
import { User } from '@prisma/client';
describe('UserService', () => {
  let service: UserService;
  let user: User;

  //todo: mock prisma
  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      imports: [forwardRef(() => AuthModule)],
      controllers: [UserController],
      providers: [UserService, PrismaService],
    }).compile();

    service = module.get<UserService>(UserService);

    const userData = {
      name: 'test',
      email: 'test@email.com',
      password: 'password1234',
    };

    //deletes test user WITH all his routines
    if (await service.user({ email: 'test@email.com' })) {
      await service.deleteUser({ email: 'test@email.com' });
    }
    user = await service.createUser(userData);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  it('should create new user', async () => {
    //user is created beforeEach test
    expect(await service.user({ email: user.email })).toEqual(user);
  });

  it('should delete user', async () => {
    await service.deleteUser({ email: user.email });
    expect(await service.user({ email: user.email })).toBeNull;
  });

  it('should update existing user', async () => {
    await service.updateUser({
      where: { email: user.email },
      data: { name: 'bob' },
    });
    expect(await service.user({ email: user.email })).toHaveProperty(
      'name',
      'bob',
    );
  });

  it('should retrieve several users', async () => {
    if (await service.user({ email: 'adam@email.com' })) {
      await service.deleteUser({ email: 'adam@email.com' });
    }
    if (await service.user({ email: 'ann@email.com' })) {
      await service.deleteUser({ email: 'ann@email.com' });
    }

    const usersCountBefore = (await service.users({})).length;
    await service.createUser({
      name: 'adam',
      email: 'adam@email.com',
      password: 'password4321',
    });
    await service.createUser({
      name: 'ann',
      email: 'ann@email.com',
      password: '4321drowssaP',
    });

    const usersCountAfter = (await service.users({})).length;

    expect(usersCountAfter - usersCountBefore).toEqual(2);
  });
});
