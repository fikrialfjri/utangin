import { Injectable } from '@nestjs/common';
import { PrismaService } from 'src/common/prisma/prisma.service';
import { DashboardSummaryResponse } from './responses/dashboard.response';
import { ContactResponse } from '../contact/responses/contact.response';

@Injectable()
export class DashboardService {
  constructor(private readonly prismaService: PrismaService) {}

  async getSummary(user: {
    username: string;
    balance: number;
  }): Promise<DashboardSummaryResponse> {
    const { username, balance } = user;

    const [debtAgg, receivableAgg, debtTrx, receivableTrx] = await Promise.all([
      this.prismaService.transaction.aggregate({
        _sum: { amount: true },
        where: { username, type: 'DEBT' },
      }),
      this.prismaService.transaction.aggregate({
        _sum: { amount: true },
        where: { username, type: 'RECEIVABLE' },
      }),
      this.prismaService.transaction.findMany({
        where: { username, type: 'DEBT' },
        orderBy: { date: 'desc' },
        select: { contact: { select: { id: true, name: true, avatar: true } } },
      }),
      this.prismaService.transaction.findMany({
        where: { username, type: 'RECEIVABLE' },
        orderBy: { date: 'desc' },
        select: { contact: { select: { id: true, name: true, avatar: true } } },
      }),
    ]);

    const extractRecentUniqueContacts = (
      transactions: {
        contact: ContactResponse;
      }[],
    ): ContactResponse[] => {
      const seen = new Set<number>();
      const contacts: ContactResponse[] = [];
      for (const trx of transactions) {
        if (trx.contact && !seen.has(trx.contact.id)) {
          seen.add(trx.contact.id);
          contacts.push({
            id: trx.contact.id,
            name: trx.contact.name,
            avatar: trx.contact.avatar,
          });
          if (contacts.length === 3) break;
        }
      }
      return contacts;
    };

    const totalDebt = debtAgg._sum.amount ?? 0;
    const totalReceivable = receivableAgg._sum.amount ?? 0;

    const receivable_debt = totalReceivable - totalDebt;
    const currentSaldo = balance ?? 0;
    const potentialSaldo = receivable_debt - currentSaldo;

    return {
      potential: { nominal: potentialSaldo },
      current: { nominal: currentSaldo },
      receivable_debt: { nominal: receivable_debt },
      debt: {
        nominal: totalDebt,
        recent_contacts: extractRecentUniqueContacts(debtTrx),
      },
      receivable: {
        nominal: totalReceivable,
        recent_contacts: extractRecentUniqueContacts(receivableTrx),
      },
    };
  }
}
