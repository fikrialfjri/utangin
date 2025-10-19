import { Injectable } from '@nestjs/common';
import { CreateTransactionDto } from './dto/create-transaction.dto';
import { UpdateTransactionDto } from './dto/update-transaction.dto';
import { TransactionResponse } from './responses/transaction.response';
import { PrismaService } from 'src/common/prisma/prisma.service';
import { Transaction } from '@prisma/client';

@Injectable()
export class TransactionService {
  constructor(private readonly prismaService: PrismaService) {}

  toTransactionResponse(transaction: Transaction): TransactionResponse {
    return {
      id: transaction.id,
      type: transaction.type,
      amount: transaction.amount,
      status: transaction.status,
      date: transaction.date,
      ...(transaction.description && { description: transaction.description }),
      ...(transaction.due_date && { due_date: new Date(transaction.due_date) }),
    };
  }

  // create(createTransactionDto: CreateTransactionDto) {
  //   return 'This action adds a new transaction';
  // }

  async findAll(username: string): Promise<TransactionResponse[]> {
    const transactions = await this.prismaService.transaction.findMany({
      where: { username },
    });

    return transactions.map((transaction) =>
      this.toTransactionResponse(transaction),
    );
  }

  // findOne(id: number) {
  //   return `This action returns a #${id} transaction`;
  // }

  // update(id: number, updateTransactionDto: UpdateTransactionDto) {
  //   return `This action updates a #${id} transaction`;
  // }

  // remove(id: number) {
  //   return `This action removes a #${id} transaction`;
  // }
}
