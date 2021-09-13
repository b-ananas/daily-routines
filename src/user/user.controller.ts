import {
  Body,
  Request,
  Controller,
  Get,
  Post,
  Res,
  UseGuards,
} from '@nestjs/common';
import {
  UserLoginType,
  UserRegisterType,
  UserReturnType,
  UserService,
} from 'src/user/user.service';
import { User as UserModel } from '@prisma/client';
import { AuthService } from 'src/auth/auth.service';
import { JwtAuthGuard } from 'src/auth/jwt.guard';
import { LocalAuthGuard } from 'src/auth/local.guard';

@Controller('user')
export class UserController {
  constructor(
    private readonly userService: UserService,
    private readonly authService: AuthService,
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

  @UseGuards(LocalAuthGuard)
  @Post('login')
  async login(@Request() req) {
    return this.authService.login(req.user);
  }

  @UseGuards(JwtAuthGuard)
  @Get('/me')
  async me(@Request() req) {
    return req.user;
  }
}
