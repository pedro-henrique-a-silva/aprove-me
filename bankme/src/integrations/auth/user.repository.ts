import { Injectable } from '@nestjs/common';
import { PrismaService } from '../../prisma/prisma.service';
import User from '../entity/User';

@Injectable()
export default class UserRepository {
  constructor(private prismaService: PrismaService) {}

  async findByUsername(username: string): Promise<User> {
    const user = await this.prismaService.users.findUnique({
      where: {
        username,
      },
    });

    if (!user) {
      return null;
    }

    return new User(user.id, user.username, user.password);
  }

  async create(user: User): Promise<User> {
    const userRegister = await this.prismaService.users.create({
      data: user.toCreate(),
    });

    return new User(
      userRegister.id,
      userRegister.username,
      userRegister.password,
    );
  }
}
