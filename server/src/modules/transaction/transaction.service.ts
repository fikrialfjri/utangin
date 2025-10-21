import { Injectable, NotFoundException } from '@nestjs/common';
import { CreateTransactionDto } from './dto/create-transaction.dto';
import { UpdateTransactionDto } from './dto/update-transaction.dto';
import { TransactionResponse } from './responses/transaction.response';
import { PrismaService } from 'src/common/prisma/prisma.service';
import { Transaction } from '@prisma/client';
import { ContactService } from '../contact/contact.service';

@Injectable()
export class TransactionService {
  constructor(
    private readonly prismaService: PrismaService,
    private readonly contactService: ContactService,
  ) {}

  toTransactionResponse(transaction: Transaction): TransactionResponse {
    return {
      id: transaction.id,
      contact_id: transaction.contact_id,
      type: transaction.type,
      amount: transaction.amount,
      status: transaction.status,
      date: transaction.date,
      ...(transaction.description && { description: transaction.description }),
      ...(transaction.due_date && { due_date: transaction.due_date }),
    };
  }

  async checkTransactionMustExists(
    username: string,
    id: number,
  ): Promise<Transaction> {
    const transaction = await this.prismaService.transaction.findFirst({
      where: { username, id },
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
    });

    return this.toTransactionResponse(newTransaction);
  }

  async findAll(username: string): Promise<TransactionResponse[]> {
    const transactions = await this.prismaService.transaction.findMany({
      where: { username },
    });

    return transactions.map((transaction) =>
      this.toTransactionResponse(transaction),
    );
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

    console.log(reqBody, '<<<<');

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
    });

    return this.toTransactionResponse(updatedTransaction);
  }

  // remove(id: number) {
  //   return `This action removes a #${id} transaction`;
  // }
}
