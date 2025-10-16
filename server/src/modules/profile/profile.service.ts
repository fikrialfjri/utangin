import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from 'src/common/prisma/prisma.service';
import { ProfileResponse } from './responses/profile.response';

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
}
