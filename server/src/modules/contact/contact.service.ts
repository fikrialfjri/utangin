import { Injectable, NotFoundException } from '@nestjs/common';
import { CreateContactDto } from './dto/create-contact.dto';
import { PrismaService } from 'src/common/prisma/prisma.service';
import {
  ContactDetailResponse,
  ContactResponse,
  GlobalContactResponse,
} from './responses/contact.response';
import { Prisma, TransactionType } from '@prisma/client';
import { UpdateContactDto } from './dto/update-contact.dto';

const contactInclude = {
  user: true,
  transactions: {
    orderBy: { date: 'desc' as const },
    include: { payments: { orderBy: { date: 'desc' as const } } },
  },
} satisfies Prisma.ContactInclude;

type Contact = Prisma.ContactGetPayload<{ include: typeof contactInclude }>;

@Injectable()
export class ContactService {
  constructor(private readonly prismaService: PrismaService) {}

  toContactResponse(contact: Contact): GlobalContactResponse;
  toContactResponse(contact: Contact, variant: 'basic'): GlobalContactResponse;
  toContactResponse(contact: Contact, variant: 'complete'): ContactResponse;
  toContactResponse(contact: Contact, variant: 'detail'): ContactDetailResponse;
  toContactResponse(
    contact: Contact,
    variant: 'basic' | 'complete' | 'detail' = 'basic',
  ): GlobalContactResponse | ContactResponse | ContactDetailResponse {
    const basicResponse = {
      id: contact.id,
      name: contact.name,
      avatar: contact.avatar,
    };

    if (variant === 'basic') return basicResponse;

    const { total_debt, total_receivable } = contact.transactions.reduce(
      (acc, tx) => {
        if (tx.type === TransactionType.DEBT) acc.total_debt += tx.amount;
        if (tx.type === TransactionType.RECEIVABLE)
          acc.total_receivable += tx.amount;
        return acc;
      },
      { total_debt: 0, total_receivable: 0 },
    );

    const net_total = total_receivable - total_debt;
    const status =
      net_total === 0
        ? undefined
        : net_total > 0
          ? TransactionType.RECEIVABLE
          : TransactionType.DEBT;
    const last_transaction = contact.transactions[0]?.date;
    const has_active_transactions = contact.transactions.some(
      (tx) => tx.status === 'ACTIVE',
    );

    const last_payment = contact.transactions.reduce<Date | undefined>(
      (latest, tx) => {
        const latestPayment = tx.payments[0]?.date;
        if (!latestPayment) return latest;
        if (!latest || latestPayment > latest) return latestPayment;
        return latest;
      },
      undefined,
    );

    const completeResponse = {
      ...basicResponse,
      total_debt,
      total_receivable,
      net_total: Math.abs(net_total),
      status,
      last_transaction,
      last_payment,
      has_active_transactions,
    };

    if (variant === 'complete') return completeResponse;

    const total_amount = contact.transactions.reduce(
      (sum, tx) => sum + tx.amount,
      0,
    );
    const total_paid = contact.transactions.reduce(
      (sum, tx) =>
        sum + tx.payments.reduce((pSum, p) => pSum + p.amount, 0),
      0,
    );
    const payment_count = contact.transactions.reduce(
      (sum, tx) => sum + tx.payments.length,
      0,
    );

    return {
      ...completeResponse,
      total_amount,
      total_paid,
      remaining: total_amount - total_paid,
      percentage: total_amount > 0 ? (total_paid / total_amount) * 100 : 0,
      payment_count,
      transaction_count: contact.transactions.length,
      transactions: contact.transactions.map((tx) => {
        const _total_paid = tx.payments.reduce((sum, p) => sum + p.amount, 0);
        return {
          id: tx.id,
          type: tx.type,
          amount: tx.amount,
          status: tx.status,
          date: tx.date,
          last_payment: tx.payments[0]?.date,
          ...(tx.note && { note: tx.note }),
          ...(tx.due_date && { due_date: tx.due_date }),
          total_paid: _total_paid,
          remaining: Math.max(tx.amount - _total_paid, 0),
          percentage:
            tx.amount > 0 ? (_total_paid / tx.amount) * 100 : 0,
        };
      }),
    };
  }

  async checkContactMustExists(username: string, id: number): Promise<Contact> {
    const contact = await this.prismaService.contact.findFirst({
      where: { username, id },
      include: contactInclude,
    });

    if (!contact) {
      throw new NotFoundException('Contact tidak ditemukan');
    }

    return contact;
  }

  async create(
    username: string,
    reqBody: CreateContactDto,
    avatarFilename?: string | null,
  ): Promise<GlobalContactResponse> {
    const newContact = await this.prismaService.contact.create({
      data: {
        name: reqBody.name,
        username,
        avatar: avatarFilename && `/uploads/photos/${avatarFilename}`,
      },
      include: contactInclude,
    });

    return this.toContactResponse(newContact);
  }

  async findAll(username: string): Promise<ContactResponse[]> {
    const contacts = await this.prismaService.contact.findMany({
      where: { username },
      include: contactInclude,
    });

    return contacts.map((contact) =>
      this.toContactResponse(contact, 'complete'),
    );
  }

  async findOne(username: string, id: number): Promise<ContactDetailResponse> {
    const contact = await this.checkContactMustExists(username, id);

    return this.toContactResponse(contact, 'detail');
  }

  async update(
    username: string,
    id: number,
    reqBody: UpdateContactDto,
    avatarFilename?: string | null,
  ): Promise<GlobalContactResponse> {
    await this.checkContactMustExists(username, id);

    const updatedContact = await this.prismaService.contact.update({
      where: { username, id },
      data: {
        name: reqBody.name,
        username,
        avatar: avatarFilename && `/uploads/photos/${avatarFilename}`,
      },
      include: contactInclude,
    });

    return this.toContactResponse(updatedContact);
  }

  async remove(username: string, id: number): Promise<GlobalContactResponse> {
    await this.checkContactMustExists(username, id);

    const contact = await this.prismaService.contact.delete({
      where: { username, id },
      include: contactInclude,
    });

    return this.toContactResponse(contact);
  }
}
