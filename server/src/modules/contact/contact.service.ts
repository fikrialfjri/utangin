import { Injectable, NotFoundException } from '@nestjs/common';
import { CreateContactDto } from './dto/create-contact.dto';
import { PrismaService } from 'src/common/prisma/prisma.service';
import { ContactResponse } from './responses/contact.response';
import { Contact } from '@prisma/client';
import { UpdateContactDto } from './dto/update-contact.dto';

@Injectable()
export class ContactService {
  constructor(private readonly prismaService: PrismaService) {}

  toContactResponse(contact: Contact): ContactResponse {
    return {
      id: contact.id,
      name: contact.name,
      username: contact.username,
      avatar: contact.avatar,
    };
  }

  async checkContactMustExists(username: string, id: number): Promise<Contact> {
    const contact = await this.prismaService.contact.findFirst({
      where: { username, id },
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
  ): Promise<ContactResponse> {
    const newContact = await this.prismaService.contact.create({
      data: {
        name: reqBody.name,
        username,
        avatar: avatarFilename && `/uploads/photos/${avatarFilename}`,
      },
    });

    return this.toContactResponse(newContact);
  }

  async findAll(username: string): Promise<ContactResponse[]> {
    const contacts = await this.prismaService.contact.findMany({
      where: { username },
    });

    return contacts.map((contact) => this.toContactResponse(contact));
  }

  async findOne(username: string, id: number): Promise<ContactResponse> {
    const contact = await this.checkContactMustExists(username, id);
    return this.toContactResponse(contact);
  }

  async update(
    username: string,
    id: number,
    reqBody: UpdateContactDto,
    avatarFilename?: string | null,
  ): Promise<ContactResponse> {
    await this.checkContactMustExists(username, id);

    const updatedContact = await this.prismaService.contact.update({
      where: { username, id },
      data: {
        name: reqBody.name,
        username,
        avatar: avatarFilename && `/uploads/photos/${avatarFilename}`,
      },
    });

    return this.toContactResponse(updatedContact);
  }

  async remove(username: string, id: number): Promise<ContactResponse> {
    await this.checkContactMustExists(username, id);

    const contact = await this.prismaService.contact.delete({
      where: { username, id },
    });

    return this.toContactResponse(contact);
  }
}
