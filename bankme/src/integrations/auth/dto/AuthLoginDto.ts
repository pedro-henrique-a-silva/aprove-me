import { ApiProperty } from '@nestjs/swagger';
import { IsEmail, IsNotEmpty } from 'class-validator';
import User from 'src/integrations/entity/User';

export default class AuthLoginDto {
  @IsNotEmpty()
  @ApiProperty({
    example: 'aproveme',
    required: true,
  })
  username: string;

  @IsNotEmpty()
  @ApiProperty({
    example: '123456',
    required: true,
  })
  password: string;

  constructor(username?: string, password?: string) {
    this.username = username;
    this.password = password;
  }

  public toEntity(): User {
    const userEntity = new User();

    userEntity.username = this.username;
    userEntity.password = this.password;

    return userEntity;
  }
}
