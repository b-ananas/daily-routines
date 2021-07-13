import { Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma.service';
import { User, Prisma } from '@prisma/client';
// const jwt = require('jsonwebtoken');
import * as jwt from 'jsonwebtoken';
import * as bcrypt from 'bcrypt';

export type UserReturnType = {
  name: string;
  email: string;
};
export type UserRegisterType = {
  name: string;
  email: string;
  password: string;
};
export type UserLoginType = { email: string; password: string };

type UserCreateInput = {
  email: string;
  name: string;
  password: string;
};
@Injectable()
export class UserService {
  private readonly jwt_secret: string;
  private readonly jwt_lifespan: number;
  constructor(private prisma: PrismaService) {
    this.jwt_secret = process.env['JWT_SECRET_KEY'];
    this.jwt_lifespan = 600;
  }

  //get single user
  async user(
    userWhereUniqueInput: Prisma.UserWhereUniqueInput,
  ): Promise<User | null> {
    return this.prisma.user.findUnique({
      where: userWhereUniqueInput,
    });
  }

  //get all users
  async users(params: {
    skip?: number;
    take?: number;
    cursor?: Prisma.UserWhereUniqueInput;
    where?: Prisma.UserWhereInput;
    orderBy?: Prisma.UserOrderByInput;
  }): Promise<User[]> {
    const { skip, take, cursor, where, orderBy } = params;
    return this.prisma.user.findMany({
      skip,
      take,
      cursor,
      where,
      orderBy,
    });
  }

  async createUser(data: UserRegisterType): Promise<User> {
    const { email, name, password } = data;
    const salt = bcrypt.genSaltSync(10);
    const hashedPassword = await bcrypt.hash(password, salt);
    return this.prisma.user.create({
      data: {
        name,
        email,
        passwordDigest: hashedPassword,
      },
    });
  }

  async authenticate(data: UserLoginType): Promise<boolean> {
    const user = await this.user({ email: data.email });
    return bcrypt.compare(data.password, user.passwordDigest);
  }

  async getAccessToken(userId: number) {
    const usr = await this.user({ id: userId });
    const token_content = jwt.sign({ email: usr.email }, this.jwt_secret, {
      algorithm: 'HS256',
      expiresIn: this.jwt_lifespan,
    });
    const token = this.prisma.token.create({
      data: {
        userId: usr.id,
        content: token_content,
        valid: true,
      },
    });
    return token;
  }

  async updateUser(params: {
    where: Prisma.UserWhereUniqueInput;
    data: Prisma.UserUpdateInput;
  }): Promise<User> {
    const { where, data } = params;
    return this.prisma.user.update({
      data,
      where,
    });
  }

  async deleteUser(where: Prisma.UserWhereUniqueInput): Promise<User> {
    return this.prisma.user.delete({
      where,
    });
  }
}
