import {
  HttpException,
  Injectable,
  UnauthorizedException,
} from '@nestjs/common';
import { AuthResponse } from './responses/auth.response';
import { PrismaService } from 'src/common/prisma/prisma.service';
import { RegisterAuthDto } from './dto/register-auth.dto';
import * as bcrypt from 'bcrypt';
import { LoginAuthDto } from './dto/login-auth.dto';
import { JwtService } from '@nestjs/jwt';

@Injectable()
export class AuthService {
  constructor(
    private readonly prismaService: PrismaService,
    private readonly jwtService: JwtService,
  ) {}

  async register(request: RegisterAuthDto): Promise<AuthResponse> {
    const { username, email } = request;

    const existingUserUsername = await this.prismaService.user.findUnique({
      where: { username },
    });
    if (existingUserUsername) {
      throw new HttpException('Username sudah tersedia', 400);
    }

    const existingUserEmail = await this.prismaService.user.findUnique({
      where: { email },
    });
    if (existingUserEmail) {
      throw new HttpException('Email sudah tersedia', 400);
    }

    request.password = await bcrypt.hash(request.password, 10);

    const user = await this.prismaService.user.create({
      data: request,
    });

    const payload = {
      username: user.username,
      full_name: user.full_name,
      email: user.full_name,
      balance: user.balance || 0,
    };

    const access_token = await this.jwtService.signAsync(payload);

    return {
      access_token,
      user: payload,
    };
  }

  async login(request: LoginAuthDto): Promise<AuthResponse> {
    const { email, password } = request;

    const findUserEmail = await this.prismaService.user.findUnique({
      where: { email },
    });

    if (!findUserEmail) {
      throw new UnauthorizedException('Email atau password tidak sesuai');
    }

    const isPasswordValid = await bcrypt.compare(
      password,
      findUserEmail.password,
    );

    if (!isPasswordValid) {
      throw new UnauthorizedException('Email atau password tidak sesuai');
    }

    const payload = {
      username: findUserEmail.username,
      full_name: findUserEmail.full_name,
      email: findUserEmail.email,
      balance: findUserEmail.balance || 0,
    };

    const access_token = await this.jwtService.signAsync(payload);

    return { access_token, user: payload };
  }
}
