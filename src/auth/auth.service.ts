import { forwardRef, Inject, Injectable } from '@nestjs/common';
import { UserLoginType, UserService } from '../user/user.service';
import { JwtService } from '@nestjs/jwt';
import { PrismaService } from 'src/prisma.service';

import * as bcrypt from 'bcrypt';
import { Prisma, prisma, User } from '@prisma/client';
import { authenticate } from 'passport';
import { async } from 'rxjs';

@Injectable()
export class AuthService {
  constructor(
    private readonly jwtService: JwtService,
    private prisma: PrismaService,
  ) {}

  async getAccessToken(user: User) {
    const token_content = this.jwtService.sign({ email: user.email });
    const token = this.prisma.token.create({
      data: {
        userId: user.id,
        content: token_content,
        valid: true,
      },
    });
    return token;
  }

  async authenticate(password: string, user: User): Promise<boolean> {
    return bcrypt.compare(password, user.passwordDigest);
  }
}
