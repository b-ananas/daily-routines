import { Strategy } from 'passport-local';
import { PassportStrategy } from '@nestjs/passport';
import { Injectable, Logger, UnauthorizedException } from '@nestjs/common';
import { AuthService } from './auth.service';

@Injectable()
export class LocalStrategy extends PassportStrategy(Strategy) {
  constructor(private authService: AuthService) {
    super({ usernameField: 'email' });
  }

  async validate(email: string, password: string): Promise<any> {
    const user = await this.authService.authenticate(email, password);
    if (!user) {
      Logger.warn(`Unsuccessful login atempt for email: ${email}`);
      throw new UnauthorizedException();
    }
    Logger.log(`Succesfull login for email: ${email}`);
    return user;
  }
}
