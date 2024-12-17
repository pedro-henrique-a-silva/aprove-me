import { Body, Controller, Get, HttpCode, Post } from '@nestjs/common';
import { AuthService } from './auth.service';
import AuthLoginDto from './dto/AuthLoginDto';
import { ApiBody, ApiResponse, ApiTags } from '@nestjs/swagger';
import { Public } from '../shared/custom-decorators/is-public.decorator';

@Controller('auth')
@ApiTags('Authentication')
export class AuthController {
  private authService: AuthService;

  constructor(authService: AuthService) {
    this.authService = authService;
  }

  @Post('login')
  @Public()
  @HttpCode(200)
  @ApiResponse({
    status: 200,
    description: 'Login successful. Returns a token.',
  })
  @ApiResponse({
    status: 401,
    description: 'Unauthorized, invalid credentials.',
  })
  @ApiBody({
    type: AuthLoginDto,
    description: 'Json structure for user object',
  })
  async login(@Body() body: AuthLoginDto) {
    const token = await this.authService.login(body.username, body.password);
    return token;
  }

  @Post('signup')
  @Public()
  @HttpCode(201)
  @ApiResponse({
    status: 201,
    description: 'User created successfully.',
  })
  @ApiResponse({
    status: 400,
    description: 'Bad request.',
  })
  @ApiBody({
    type: AuthLoginDto,
    description: 'Json structure for user object',
  })
  async signup(@Body() body: AuthLoginDto) {
    await this.authService.signup(body.toEntity());
  }

  @Get('me')
  @ApiResponse({
    status: 200,
    description: 'User found.',
  })
  @ApiResponse({
    status: 401,
    description: 'Unauthorized, invalid token.',
  })
  async me() {
    return 'me';
  }
}
