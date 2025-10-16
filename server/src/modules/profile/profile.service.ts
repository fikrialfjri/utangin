import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from 'src/common/prisma/prisma.service';
import { ProfileResponse } from './responses/profile.response';
import { UpdateBalanceProfileDto } from './dto/update-balance-profile.dto';

@Injectable()
export class ProfileService {
  constructor(private readonly prismaService: PrismaService) {}

  async detail(username: string): Promise<ProfileResponse> {
    const user = await this.prismaService.user.findUnique({
      where: { username },
      select: { username: true, full_name: true, email: true, balance: true },
    });

    if (!user) {
      throw new NotFoundException(
        `User dengan username ${username} tidak ditemukan`,
      );
    }

    return { ...user, balance: user.balance || 0 };
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
      select: { username: true, full_name: true, email: true, balance: true },
    });

    return { ...updatedBalanceUser, balance: updatedBalanceUser.balance || 0 };
  }
}
