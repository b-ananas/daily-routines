import {
  Injectable,
  CanActivate,
  ExecutionContext,
  UnauthorizedException,
  NotFoundException,
} from '@nestjs/common';
import { RoutineService } from './routine.service';

//this guard checks if user contained in request owns(has access? maybe later put into some method in a service) given routine
@Injectable()
export class RoutineGuard implements CanActivate {
  constructor(private readonly routineService: RoutineService) {}
  async canActivate(context: ExecutionContext): Promise<boolean> {
    const request = context.switchToHttp().getRequest();
    const routineId = request.params.id;
    const routine = await this.routineService.routine({
      id: Number(routineId),
    });
    const user = request.user;
    if (!routine) {
      throw new NotFoundException();
    } else if (routine.ownerId != user.userId) {
      throw new UnauthorizedException();
    } else {
      return true;
    }
  }
}
