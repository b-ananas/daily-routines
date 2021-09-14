import { forwardRef, Module } from '@nestjs/common';
import { JwtModule } from '@nestjs/jwt';
import { PassportModule } from '@nestjs/passport';
import { PrismaService } from '../prisma.service';
import { UserModule } from '../user/user.module';
import { AuthService } from './auth.service';
import { JwtStrategy } from './jwt.strategy';
import { LocalStrategy } from './local.strategy';

@Module({
  imports: [
    forwardRef(() => UserModule),
    PassportModule,
    JwtModule.register({
      secret: process.env['JWT_SECRET_KEY'],
      signOptions: { expiresIn: `${process.env['JWT_EXPIRATION_TIME']}s` },
    }),
  ],
  providers: [AuthService, PrismaService, LocalStrategy, JwtStrategy],
  exports: [AuthService],
})
export class AuthModule {}
