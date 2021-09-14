import { Test, TestingModule } from '@nestjs/testing';
import { PrismaService } from '../prisma.service';
import { UserModule } from '../user/user.module';
import { AuthModule } from '../auth/auth.module';
import { RoutineController } from './routine.controller';
import { RoutineService } from './routine.service';

describe('RoutineController', () => {
  let controller: RoutineController;

  //TODO: mockup prisma service
  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      imports: [AuthModule, UserModule],
      controllers: [RoutineController],
      providers: [RoutineService, PrismaService],
    }).compile();

    controller = module.get<RoutineController>(RoutineController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
