import { HttpException, Injectable } from '@nestjs/common';
import { AuthResponse } from './responses/auth.response';
import { PrismaService } from 'src/common/prisma/prisma.service';
import { RegisterAuthDto } from './dto/register-auth.dto';
import * as bcrypt from 'bcrypt';

@Injectable()
export class AuthService {
  constructor(private readonly prismaService: PrismaService) {}

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

    return {
      username: user.username,
      full_name: user.full_name,
      email: user.full_name,
      balance: user.balance || 0,
    };
  }
}
