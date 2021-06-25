import {
  Controller,
  Get,
  Param,
  Post,
  Body,
  Put,
  Delete,
} from '@nestjs/common';
import { UserService } from './services/user.service';
import { RoutineService } from './services/routine.service';
import { User as UserModel, Routine as RoutineModel } from '@prisma/client';

@Controller()
export class AppController {
  constructor(
    private readonly userService: UserService,
    private readonly routineService: RoutineService,
  ) {}

  @Get('routine/:id')
  async getRoutineById(@Param('id') id: string): Promise<RoutineModel> {
    return this.routineService.routine({ id: Number(id) });
  }

  @Get('routines')
  async getActiveRoutines(): Promise<RoutineModel[]> {
    return this.routineService.routines({
      where: { active: true },
    });
  }

  @Post('routine')
  async createDraft(
    @Body() routineData: { title: string; desc?: string; authorEmail: string },
  ): Promise<RoutineModel> {
    const { title, desc, authorEmail } = routineData;
    return this.routineService.createRoutine({
      title,
      desc,
      owner: {
        connect: { email: authorEmail },
      },
    });
  }

  @Post('user')
  async signupUser(
    @Body() userData: { name?: string; email: string },
  ): Promise<UserModel> {
    return this.userService.createUser(userData);
  }

  @Put('update/:id')
  async addRoutine(@Param('id') id: string): Promise<RoutineModel> {
    return this.routineService.updateRoutine({
      where: { id: Number(id) },
      data: { active: true },
    });
  }

  @Delete('routine/:id')
  async deleteRoutine(@Param('id') id: string): Promise<RoutineModel> {
    return this.routineService.deleteRoutine({ id: Number(id) });
  }
}
