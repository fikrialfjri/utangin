import {
  Controller,
  Post,
  Body,
  Req,
  UploadedFile,
  UseGuards,
  UseInterceptors,
  UnsupportedMediaTypeException,
  Get,
  ParseIntPipe,
  Param,
} from '@nestjs/common';
import { ContactService } from './contact.service';
import { CreateContactDto } from './dto/create-contact.dto';
import { BaseResponse } from 'src/common/interfaces/base-response.interface';
import { ContactResponse } from './responses/contact.response';
import { JwtAuthGuard } from 'src/common/auth/guards/logged-in.guard';
import { FileInterceptor } from '@nestjs/platform-express';
import { diskStorage } from 'multer';
import { extname } from 'node:path';

@Controller('api/contact')
@UseGuards(JwtAuthGuard)
export class ContactController {
  constructor(private readonly contactService: ContactService) {}

  @Post()
  @UseInterceptors(
    FileInterceptor('avatar', {
      storage: diskStorage({
        destination: './public/uploads/photos',
        filename: (req, file, cb) => {
          const uniqueSuffix =
            Date.now() + '-' + Math.round(Math.random() * 1e9);
          cb(null, uniqueSuffix + extname(file.originalname));
        },
      }),
      fileFilter: (req, file, cb) => {
        if (
          !new RegExp(/\.(jpg|jpeg|png|gif|avif|webp)$/).exec(file.originalname)
        ) {
          return cb(
            new UnsupportedMediaTypeException(
              'Format avatar tidak didukung. Hanya file gambar (JPG, JPEG, PNG, GIF, AVIF, atau WEBP) yang diperbolehkan.',
            ),
            false,
          );
        }
        cb(null, true);
      },
    }),
  )
  async create(
    @Req() req: Request & { user: { username: string } },
    @Body() reqBody: CreateContactDto,
    @UploadedFile() avatar: Express.Multer.File | undefined,
  ): Promise<BaseResponse<ContactResponse>> {
    return {
      message: 'Data contact berhasil dibuat',
      data: await this.contactService.create(
        req.user.username,
        reqBody,
        avatar?.filename,
      ),
    };
  }

  @Get()
  async findAll(
    @Req() req: Request & { user: { username: string } },
  ): Promise<BaseResponse<ContactResponse[]>> {
    return {
      message: 'Data contact berhasil dimuat',
      data: await this.contactService.findAll(req.user.username),
    };
  }

  @Get(':id')
  async findOne(
    @Req() req: Request & { user: { username: string } },
    @Param('id', ParseIntPipe) id: number,
  ): Promise<BaseResponse<ContactResponse>> {
    return {
      message: 'Data detail contact berhasil dimuat',
      data: await this.contactService.findOne(req.user.username, id),
    };
  }
}
