import { Controller, Get, Req, UseGuards } from '@nestjs/common';
import { JwtAuthGuard } from 'src/common/auth/guards/logged-in.guard';
import { DashboardService } from './dashboard.service';
import { BaseResponse } from 'src/common/interfaces/base-response.interface';
import { DashboardSummaryResponse } from './responses/dashboard.response';

@Controller('api/dashboard')
@UseGuards(JwtAuthGuard)
export class DashboardController {
  constructor(private readonly dashboardService: DashboardService) {}

  @Get('summary')
  async getSummary(
    @Req() req: Request & { user: { username: string; balance: number } },
  ): Promise<BaseResponse<DashboardSummaryResponse>> {
    return {
      message: 'Dashboard summary berhasil dimuat',
      data: await this.dashboardService.getSummary({
        username: req.user.username,
        balance: req.user.balance,
      }),
    };
  }
}
