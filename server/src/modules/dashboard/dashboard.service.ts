import { Injectable } from '@nestjs/common';
import { PrismaService } from 'src/common/prisma/prisma.service';
import { DashboardSummaryResponse } from './responses/dashboard.response';

@Injectable()
export class DashboardService {
  constructor(private readonly prismaService: PrismaService) {}

  async getSummary(user: {
    username: string;
    balance: number;
  }): Promise<DashboardSummaryResponse> {
    const { username, balance } = user;

    const [debtAgg, receivableAgg] = await Promise.all([
      this.prismaService.transaction.aggregate({
        _sum: { amount: true },
        where: { username, type: 'DEBT' },
      }),
      this.prismaService.transaction.aggregate({
        _sum: { amount: true },
        where: { username, type: 'RECEIVABLE' },
      }),
    ]);

    const totalDebt = debtAgg._sum.amount ?? 0;
    const totalReceivable = receivableAgg._sum.amount ?? 0;

    const receivable_debt = totalReceivable - totalDebt;
    const currentSaldo = balance ?? 0;
    const potentialSaldo = receivable_debt - currentSaldo;

    return {
      potential: { nominal: potentialSaldo },
      current: { nominal: currentSaldo },
      receivable_debt: { nominal: receivable_debt },
      debt: { nominal: totalDebt },
      receivable: { nominal: totalReceivable },
    };
  }
}
