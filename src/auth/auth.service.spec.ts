import { forwardRef } from '@nestjs/common';
import { JwtModule, JwtService } from '@nestjs/jwt';
import { Test, TestingModule } from '@nestjs/testing';
import { PrismaService } from '../prisma.service';
import { UserModule } from '../user/user.module';
import { AuthService } from './auth.service';

describe('AuthService', () => {
  let service: AuthService;
  let jwtService: JwtService;

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

    service = module.get<AuthService>(AuthService);
    jwtService = module.get<JwtService>(JwtService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  //checks jwt configuration
  it('should have access to jwtService', () => {
    expect(jwtService).toBeDefined();
  });
});
