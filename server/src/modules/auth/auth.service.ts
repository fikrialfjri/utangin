import {
  ConflictException,
  Injectable,
  UnauthorizedException,
} from '@nestjs/common';
import { AuthResponse, UserResponse } from './responses/auth.response';
import { PrismaService } from 'src/common/prisma/prisma.service';
import { RegisterAuthDto } from './dto/register-auth.dto';
import * as bcrypt from 'bcrypt';
import { LoginAuthDto } from './dto/login-auth.dto';
import { JwtService } from '@nestjs/jwt';
import { User } from '@prisma/client';

@Injectable()
export class AuthService {
  constructor(
    private readonly prismaService: PrismaService,
    private readonly jwtService: JwtService,
  ) {}

  toUserResponse(user: User): UserResponse {
    return {
      username: user.username,
      full_name: user.full_name,
      email: user.email,
      balance: user.balance ?? 0,
    };
  }

  async register(request: RegisterAuthDto): Promise<AuthResponse> {
    const { username, email } = request;

    const existingUserUsername = await this.prismaService.user.findUnique({
      where: { username },
    });
    if (existingUserUsername) {
      throw new ConflictException('Username sudah tersedia');
    }

    const existingUserEmail = await this.prismaService.user.findUnique({
      where: { email },
    });
    if (existingUserEmail) {
      throw new ConflictException('Email sudah tersedia');
    }

    request.password = await bcrypt.hash(request.password, 10);

    const user = await this.prismaService.user.create({
      data: request,
    });

    const userResponse = this.toUserResponse(user);

    const access_token = await this.jwtService.signAsync(userResponse);

    return {
      access_token,
      user: userResponse,
    };
  }

  async login(request: LoginAuthDto): Promise<AuthResponse> {
    const { email, password } = request;

    const findUserEmail = await this.prismaService.user.findUnique({
      where: { email },
    });

    if (!findUserEmail) {
      throw new UnauthorizedException('Email atau password tidak sesuai', {
        description: 'Wrong Credentials',
      });
    }

    const isPasswordValid = await bcrypt.compare(
      password,
      findUserEmail.password,
    );

    if (!isPasswordValid) {
      throw new UnauthorizedException('Email atau password tidak sesuai', {
        description: 'Wrong Credentials',
      });
    }

    const userResponse = this.toUserResponse(findUserEmail);

    const access_token = await this.jwtService.signAsync(userResponse);

    return { access_token, user: userResponse };
  }
}
