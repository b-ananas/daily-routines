import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { PrismaService } from './prisma.service';
import { UserService } from './user/user.service';
import { RoutineModule } from './routine/routine.module';
import { UserModule } from './user/user.module';
import { AuthModule } from './auth/auth.module';
import { RoutineInstanceModule } from './routine-instance/routine-instance.module';

@Module({
  imports: [RoutineModule, UserModule, AuthModule, RoutineInstanceModule],
  controllers: [AppController],
  providers: [AppService, PrismaService, UserService],
})
export class AppModule {}
