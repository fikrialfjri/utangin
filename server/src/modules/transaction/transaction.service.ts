import {
  Inject,
  Injectable,
  NotFoundException,
  forwardRef,
} from '@nestjs/common';
import { CreateTransactionDto } from './dto/create-transaction.dto';
import { UpdateTransactionDto } from './dto/update-transaction.dto';
import {
  GroupedTransactionResponse,
  TransactionResponse,
} from './responses/transaction.response';
import { PrismaService } from 'src/common/prisma/prisma.service';
import { Prisma } from '@prisma/client';
import { ContactService } from '../contact/contact.service';
import { GetTransactionDto } from './dto/get-transaction.dto';
import dayjs from 'dayjs';

const transactionInclude = {
  contact: true,
} satisfies Prisma.TransactionInclude;

type Transaction = Prisma.TransactionGetPayload<{
  include: typeof transactionInclude;
}>;

@Injectable()
export class TransactionService {
  constructor(
    private readonly prismaService: PrismaService,
    @Inject(forwardRef(() => ContactService))
    private readonly contactService: ContactService,
  ) {}

  toTransactionResponse(transaction: Transaction): TransactionResponse {
    return {
      id: transaction.id,
      type: transaction.type,
      amount: transaction.amount,
      status: transaction.status,
      date: transaction.date,
      ...(transaction.description && { description: transaction.description }),
      ...(transaction.due_date && { due_date: transaction.due_date }),
      contact: {
        id: transaction.contact.id,
        name: transaction.contact.name,
        avatar: transaction.contact.avatar,
      },
    };
  }

  groupTransactionsByMonth(
    transactions: TransactionResponse[],
  ): GroupedTransactionResponse[] {
    const grouped: { [month: string]: TransactionResponse[] } = {};
    transactions.forEach((tx) => {
      const month: string = dayjs(tx.date).format('YYYY-MM');
      if (!grouped[month]) grouped[month] = [];
      grouped[month].push(tx);
    });

    return Object.entries(grouped)
      .map(([month, txs]) => ({
        month,
        label: dayjs(month).format('MMM YYYY'),
        transactions: txs,
      }))
      .sort((a, b) => b.month.localeCompare(a.month)); // Latest first
  }

  async checkTransactionMustExists(
    username: string,
    id: number,
  ): Promise<Transaction> {
    const transaction = await this.prismaService.transaction.findFirst({
      where: { username, id },
      include: transactionInclude,
    });

    if (!transaction) {
      throw new NotFoundException('Transaksi tidak ditemukan');
    }

    return transaction;
  }

  async create(
    username: string,
    reqBody: CreateTransactionDto,
  ): Promise<TransactionResponse> {
    await this.contactService.checkContactMustExists(
      username,
      reqBody.contact_id,
    );

    const newTransaction = await this.prismaService.transaction.create({
      data: {
        username,
        contact_id: reqBody.contact_id,
        type: reqBody.type,
        amount: reqBody.amount,
        date: new Date(reqBody.date),
        ...(reqBody.status && { status: reqBody.status }),
        ...(reqBody.description && { description: reqBody.description }),
        ...(reqBody.due_date && { due_date: new Date(reqBody.due_date) }),
      },
      include: transactionInclude,
    });

    return this.toTransactionResponse(newTransaction);
  }

  async findAll(
    username: string,
    reqParams: GetTransactionDto,
  ): Promise<{
    data: TransactionResponse[] | GroupedTransactionResponse[];
    total: number;
  }> {
    const { page, limit: take, group_by, type } = reqParams;

    const skip: number = (page! - 1) * take!;

    const [transactions, count] = await Promise.all([
      this.prismaService.transaction.findMany({
        where: { username, type },
        include: transactionInclude,
        orderBy: { date: 'desc' },
        ...(take ? { skip, take } : {}),
      }),
      this.prismaService.transaction.count({ where: { username } }),
    ]);

    let result: TransactionResponse[] | GroupedTransactionResponse[] =
      transactions.map((transaction) =>
        this.toTransactionResponse(transaction),
      );
    if (group_by === 'month') {
      result = this.groupTransactionsByMonth(result);

      if (page && take) {
        result = result.slice(skip, skip + take);
      }
    }

    return {
      data: result,
      total: count,
    };
  }

  async findOne(username: string, id: number): Promise<TransactionResponse> {
    const transaction = await this.checkTransactionMustExists(username, id);
    return this.toTransactionResponse(transaction);
  }

  async update(
    username: string,
    id: number,
    reqBody: UpdateTransactionDto,
  ): Promise<TransactionResponse> {
    await this.checkTransactionMustExists(username, id);
    await this.contactService.checkContactMustExists(
      username,
      Number(reqBody.contact_id),
    );

    const updatedTransaction = await this.prismaService.transaction.update({
      where: { username, id },
      data: {
        username,
        contact_id: reqBody.contact_id,
        type: reqBody.type,
        amount: reqBody.amount,
        date: reqBody.date && new Date(reqBody.date),
        status: reqBody.status,
        ...(reqBody.description && { description: reqBody.description }),
        ...(reqBody.due_date && { due_date: new Date(reqBody.due_date) }),
      },
      include: transactionInclude,
    });

    return this.toTransactionResponse(updatedTransaction);
  }

  async remove(username: string, id: number) {
    await this.checkTransactionMustExists(username, id);

    const deletedTransaction = await this.prismaService.transaction.delete({
      where: { username, id },
      include: transactionInclude,
    });

    return this.toTransactionResponse(deletedTransaction);
  }
}
