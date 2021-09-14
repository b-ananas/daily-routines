import { Test, TestingModule } from '@nestjs/testing';
import { RoutineService } from './routine.service';
import { PrismaService } from '../prisma.service';
import { UserModule } from '../user/user.module';
import { AuthModule } from '../auth/auth.module';
import { RoutineController } from './routine.controller';

describe('RoutineService', () => {
  let service: RoutineService;

  //todo: mock prisma
  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      imports: [AuthModule, UserModule],
      controllers: [RoutineController],
      providers: [RoutineService, PrismaService],
    }).compile();

    service = module.get<RoutineService>(RoutineService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
