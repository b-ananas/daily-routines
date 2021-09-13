import { forwardRef, Inject, Injectable, Logger } from '@nestjs/common';
import { UserLoginType, UserService } from '../user/user.service';
import { JwtService } from '@nestjs/jwt';
import { PrismaService } from 'src/prisma.service';

import * as bcrypt from 'bcrypt';

@Injectable()
export class AuthService {
  constructor(
    private jwtService: JwtService,
    private userService: UserService,
    private prisma: PrismaService,
  ) {}
  async authenticate(userEmail: string, password: string): Promise<any> {
    const user = await this.userService.user({ email: userEmail });
    if (bcrypt.compare(password, user.passwordDigest)) {
      Logger.log(`Password authentication for email ${userEmail} successful!`);
      const { passwordDigest, ...answ } = user;
      return answ;
    } else {
      Logger.warn(
        `Password authentication for email ${userEmail} unsuccessful!`,
      );
      return null;
    }
  }
  async login(user: any) {
    Logger.log(JSON.stringify(user));
    const payload = { email: user.email, username: user.name, sub: user.id };
    return {
      access_token: this.jwtService.sign(payload),
    };
  }
}
