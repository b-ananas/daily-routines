import { Injectable } from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';

//This guard sets user in request object based on provided bearer jwt
@Injectable()
export class JwtAuthGuard extends AuthGuard('jwt') {}
