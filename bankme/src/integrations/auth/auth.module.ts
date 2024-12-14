import { Module } from '@nestjs/common';
import { AuthService } from './auth.service';
import { AuthController } from './auth.controller';
import { AssignorModule } from '../assignor/assignor.module';
import UserRepository from './user.repository';

@Module({
  imports: [AssignorModule],
  providers: [AuthService, UserRepository],
  controllers: [AuthController],
})
export class AuthModule {}
