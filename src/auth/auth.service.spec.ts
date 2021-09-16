import { forwardRef } from '@nestjs/common';
import { JwtModule, JwtService } from '@nestjs/jwt';
import { Test, TestingModule } from '@nestjs/testing';
import { PrismaService } from '../prisma.service';
import { UserModule } from '../user/user.module';
import { AuthService } from './auth.service';
import * as bcrypt from 'bcrypt';
import { UserService } from 'src/user/user.service';
import { Prisma } from '@prisma/client';

describe('AuthService', () => {
  let service: AuthService;
  let jwtService: JwtService;
  let user;
  const password = 'Password1234';

  //TODO: mockup prisma service
  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      imports: [
        forwardRef(() => UserModule),
        JwtModule.register({
          secret: process.env['JWT_SECRET_KEY'],
          signOptions: { expiresIn: '60s' },
        }),
      ],
      providers: [AuthService, PrismaService],
    }).compile();

    jwtService = module.get<JwtService>(JwtService);
    service = module.get<AuthService>(AuthService);
    user = {
      email: 'email@test.com',
      name: 'john',
      id: 1,
    };
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  //checks jwt configuration
  it('should have access to jwtService', () => {
    expect(jwtService).toBeDefined();
  });

  it('should sign token based on user entity', async () => {
    expect(await service.login(user)).toHaveProperty('access_token'); //toBeInstanceOf(String);
  });

  it('should verify user password', async () => {
    const salt = bcrypt.genSaltSync(10);
    const hashedPassword = await bcrypt.hash(password, salt);
    const userService = new UserService(new PrismaService());
    jest.spyOn(userService, 'user').mockImplementation(
      jest.fn((userWhereUniqueInput: Prisma.UserWhereUniqueInput) => {
        return new Promise((resolve, reject) => {
          resolve({ ...user, passwordDigest: hashedPassword });
        });
      }),
    );

    //overwriting existing service with service based on mocked user service
    service = new AuthService(jwtService, userService, new PrismaService());

    expect(await service.authenticate(user.email, password)).toEqual(user);
  });
});
