import { Body, Controller, Post } from '@nestjs/common';
import { AuthService } from './auth.service';
import { RegisterAuthDto } from './dto/register-auth.dto';
import { AuthResponse } from './responses/auth.response';

@Controller('api/auth')
export class AuthController {
  constructor(private authService: AuthService) {}

  @Post('register')
  async register(@Body() request: RegisterAuthDto): Promise<AuthResponse> {
    return await this.authService.register(request);
  }
}
