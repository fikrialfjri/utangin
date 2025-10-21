import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from 'src/common/prisma/prisma.service';
import { ProfileResponse } from './responses/profile.response';
import { UpdateBalanceProfileDto } from './dto/update-balance-profile.dto';
import { AuthService } from '../auth/auth.service';

@Injectable()
export class ProfileService {
  constructor(
    private readonly prismaService: PrismaService,
    private readonly authService: AuthService,
  ) {}

  async detail(username: string): Promise<ProfileResponse> {
    const user = await this.prismaService.user.findUnique({
      where: { username },
    });

    if (!user) {
      throw new NotFoundException(
        `User dengan username ${username} tidak ditemukan`,
      );
    }

    return this.authService.toUserResponse(user);
  }

  async updateBalance(
    username: string,
    reqBody: UpdateBalanceProfileDto,
  ): Promise<ProfileResponse> {
    const user = await this.prismaService.user.findUnique({
      where: { username },
    });

    if (!user) {
      throw new NotFoundException(
        `User dengan username ${username} tidak ditemukan`,
      );
    }

    const updatedBalanceUser = await this.prismaService.user.update({
      where: { username },
      data: {
        balance: reqBody.balance,
      },
    });

    return this.authService.toUserResponse(updatedBalanceUser);
  }
}
