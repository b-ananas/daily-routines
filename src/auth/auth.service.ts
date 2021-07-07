import { Injectable } from '@nestjs/common';
import { UserService } from 'src/user/user.service';

import { User, Prisma } from '@prisma/client';

@Injectable()
export class AuthService {
  constructor(private userService: UserService) {}

  async validateUser(userWhereUniqueInput: Prisma.UserWhereUniqueInput, password: string): Promise<User | null> {
    const user = this.userService.user(userWhereUniqueInput);
    const hsahedPassword = password; //todo: hash
    return null;
  }
}
