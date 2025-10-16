import { Controller, Get, Req, UseGuards } from '@nestjs/common';
import { ProfileService } from './profile.service';
import { BaseResponse } from 'src/common/interfaces/base-response.interface';
import { ProfileResponse } from './responses/profile.response';
import { JwtAuthGuard } from 'src/common/auth/guards/logged-in.guard';

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
}
