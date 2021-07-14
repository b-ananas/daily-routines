import { Body, Controller, Get, Post } from '@nestjs/common';
import {
  UserLoginType,
  UserRegisterType,
  UserReturnType,
  UserService,
} from 'src/user/user.service';
import { User as UserModel } from '@prisma/client';
import { AuthService } from 'src/auth/auth.service';

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
  @Post('/login')
  async signinUser(@Body() userData: UserLoginType) {
    const user = await this.userService.user({ email: userData.email });
    if (await this.authService.authenticate(userData.password, user)) {
      const tokenEntity = await this.authService.getAccessToken(user);
      //todo: set http only cookie instead of returning
      return {
        login: true,
        token: tokenEntity.content,
      };
    }
    return null;
  }
}
// /* wip:

// @Post('/login')
// async signinUser(@Body() userData: UserLoginType, @Response() res: Response) {
//   const user = await this.userService.user({ email: userData.email });
//   if (await this.authService.authenticate(userData.password, user)) {
//     const tokenEntity = await this.authService.getAccessToken(user);
//     res.cookie('accessToken', tokenEntity.content, {
//       expires: new Date(new Date().getTime() + 60 * 1000),
//       sameSite: 'strict',
//       httpOnly: true,
//     });
//     return res.send();
//   }
//   return null;
// } /*
