import { Injectable, NotFoundException } from '@nestjs/common';
import { CreateContactDto } from './dto/create-contact.dto';
import { PrismaService } from 'src/common/prisma/prisma.service';
import {
  ContactResponse,
  GlobalContactResponse,
} from './responses/contact.response';
import { Prisma, TransactionType } from '@prisma/client';
import { UpdateContactDto } from './dto/update-contact.dto';

const contactInclude = {
  user: true,
  transactions: true,
} satisfies Prisma.ContactInclude;

type Contact = Prisma.ContactGetPayload<{ include: typeof contactInclude }>;

@Injectable()
export class ContactService {
  constructor(private readonly prismaService: PrismaService) {}

  toContactResponse(contact: Contact): GlobalContactResponse;
  toContactResponse(contact: Contact, variant: 'basic'): GlobalContactResponse;
  toContactResponse(contact: Contact, variant: 'complete'): ContactResponse;
  toContactResponse(
    contact: Contact,
    variant: 'basic' | 'complete' = 'basic',
  ): GlobalContactResponse | ContactResponse {
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
      net_total !== 0
        ? undefined
        : net_total > 0
          ? TransactionType.RECEIVABLE
          : TransactionType.DEBT;

    const completeResponse = {
      ...basicResponse,
      total_debt,
      total_receivable,
      net_total: Math.abs(net_total),
      status,
    };

    return completeResponse;
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

  async findOne(username: string, id: number): Promise<GlobalContactResponse> {
    const contact = await this.checkContactMustExists(username, id);

    return this.toContactResponse(contact);
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
