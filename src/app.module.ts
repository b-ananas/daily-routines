import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { PrismaService } from './prisma.service';
import { UserService } from './user/user.service';
import { RoutineModule } from './routine/routine.module';
import { UserModule } from './user/user.module';
import { AuthModule } from './auth/auth.module';
import { RoutineInstanceModule } from './routine-instance/routine-instance.module';
import { RouterModule } from 'nest-router';
import { routes } from './routes';
import { ActivityModule } from './activity/activity.module';
import { ActivityInstanceModule } from './activity-instance/activity-instance.module';

@Module({
  imports: [
    RouterModule.forRoutes(routes),
    RoutineModule,
    UserModule,
    AuthModule,
    RoutineInstanceModule,
    ActivityModule,
    ActivityInstanceModule,
  ],
  controllers: [AppController],
  providers: [AppService, PrismaService, UserService],
})
export class AppModule {}
