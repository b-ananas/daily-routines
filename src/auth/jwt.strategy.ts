import { ExtractJwt, Strategy } from 'passport-jwt';
import { PassportStrategy } from '@nestjs/passport';
import { Injectable, Logger } from '@nestjs/common';

@Injectable()
export class JwtStrategy extends PassportStrategy(Strategy) {
  constructor() {
    super({
      jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
      ignoreExpiration: false,
      secretOrKey: process.env['JWT_SECRET_KEY'],
    });
  }

  async validate(payload: any) {
    Logger.log(`Payload from jwt: ${JSON.stringify(payload)}`);
    return { userId: payload.sub, email: payload.email };
  }
}
