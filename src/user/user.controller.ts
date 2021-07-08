import { Body, Controller, Get, Post } from '@nestjs/common';
import {
  UserLoginType,
  UserRegisterType,
  UserReturnType,
  UserService,
} from 'src/user/user.service';

import { User as UserModel } from '@prisma/client';

@Controller('user')
export class UserController {
  constructor(
    private readonly userService: UserService,
  ) {}

  @Post('/')
  async signupUser(
    @Body() userData: UserRegisterType,
  ): Promise<UserReturnType> {
    const user = await this.userService.createUser({
      ...userData,
    });
    return {
      name: user.name,
      email: user.email,
    };
  }
  @Post('/login')
  async signinUser(@Body() userData: UserLoginType) {
    if (await this.userService.authenticate(userData)) {
      //return token
    }
    return null;
  }
}
