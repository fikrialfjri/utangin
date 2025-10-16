import { Body, Controller, Post } from '@nestjs/common';
import { AuthService } from './auth.service';
import { RegisterAuthDto } from './dto/register-auth.dto';
import { AuthResponse } from './responses/auth.response';
import { LoginAuthDto } from './dto/login-auth.dto';

@Controller('api/auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @Post('register')
  async register(@Body() reqBody: RegisterAuthDto): Promise<AuthResponse> {
    return await this.authService.register(reqBody);
  }

  @Post('login')
  async login(@Body() reqBody: LoginAuthDto): Promise<AuthResponse> {
    return await this.authService.login(reqBody);
  }
}
