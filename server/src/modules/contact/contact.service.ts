import { Injectable } from '@nestjs/common';
import { CreateContactDto } from './dto/create-contact.dto';
import { PrismaService } from 'src/common/prisma/prisma.service';
import { ContactResponse } from './responses/contact.response';
import { Contact } from '@prisma/client';

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

  // findAll() {
  //   return `This action returns all contact`;
  // }

  // findOne(id: number) {
  //   return `This action returns a #${id} contact`;
  // }

  // update(id: number, reqBody: UpdateContactDto) {
  //   return `This action updates a #${id} contact`;
  // }

  // remove(id: number) {
  //   return `This action removes a #${id} contact`;
  // }
}
