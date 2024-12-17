import { ConflictException, Injectable, UnauthorizedException } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import * as bcrypt from 'bcrypt';
import UserRepository from './user.repository';
import User from '../entity/User';

@Injectable()
export class AuthService {
  private userRepository: UserRepository;
  private jwtService: JwtService;

  constructor(userRepository: UserRepository, jwtService: JwtService) {
    this.userRepository = userRepository;
    this.jwtService = jwtService;
  }

  async login(username: string, password: string) {
    const user = await this.userRepository.findByUsername(username);

    const isPasswordValid = await bcrypt.compare(password, user.password);

    if (!isPasswordValid) {
      throw new UnauthorizedException();
    }

    const payload = { username: user.username, id: user.id };
    return {
      token: await this.jwtService.signAsync(payload),
    };
  }

  async signup(user: User) {
    const userExist = await this.userRepository.findByUsername(user.username);

    if (user) {
      throw new ConflictException('User already exists.');
    }

    const hashedPassword = await bcrypt.hash(user.password, 10);

    user.password = hashedPassword;

    await this.userRepository.create(user);
  }
}
