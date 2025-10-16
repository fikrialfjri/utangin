import { Body, Controller, Get, Patch, Req, UseGuards } from '@nestjs/common';
import { ProfileService } from './profile.service';
import { BaseResponse } from 'src/common/interfaces/base-response.interface';
import { ProfileResponse } from './responses/profile.response';
import { JwtAuthGuard } from 'src/common/auth/guards/logged-in.guard';
import { UpdateBalanceProfileDto } from './dto/update-balance-profile.dto';

@Controller('api/profile')
@UseGuards(JwtAuthGuard)
export class ProfileController {
  constructor(private readonly profileService: ProfileService) {}

  @Get()
  async detail(
    @Req() req: Request & { user: { username: string } },
  ): Promise<BaseResponse<ProfileResponse>> {
    return {
      message: 'Data profil berhasil dimuat',
      data: await this.profileService.detail(req.user.username),
    };
  }

  @Patch('balance')
  async updateBalance(
    @Req() req: Request & { user: { username: string } },
    @Body() reqBody: UpdateBalanceProfileDto,
  ): Promise<BaseResponse<ProfileResponse>> {
    return {
      message: 'Data profile berhasil diperbarui',
      data: await this.profileService.updateBalance(req.user.username, reqBody),
    };
  }
}
