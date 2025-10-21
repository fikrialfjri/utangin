import {
  Controller,
  Get,
  Post,
  Body,
  Param,
  Delete,
  Req,
  UseGuards,
  ParseIntPipe,
  Put,
} from '@nestjs/common';
import { TransactionService } from './transaction.service';
import { CreateTransactionDto } from './dto/create-transaction.dto';
import { UpdateTransactionDto } from './dto/update-transaction.dto';
import { BaseResponse } from 'src/common/interfaces/base-response.interface';
import { TransactionResponse } from './responses/transaction.response';
import { JwtAuthGuard } from 'src/common/auth/guards/logged-in.guard';

@Controller('api/transaction')
@UseGuards(JwtAuthGuard)
export class TransactionController {
  constructor(private readonly transactionService: TransactionService) {}

  @Post()
  async create(
    @Req() req: Request & { user: { username: string } },
    @Body() reqBody: CreateTransactionDto,
  ): Promise<BaseResponse<TransactionResponse>> {
    return {
      message: 'Data transaksi berhasil dibuat',
      data: await this.transactionService.create(req.user.username, reqBody),
    };
  }

  @Get()
  async findAll(
    @Req() req: Request & { user: { username: string } },
  ): Promise<BaseResponse<TransactionResponse[]>> {
    return {
      message: 'Data list transaksi berhasil dimuat',
      data: await this.transactionService.findAll(req.user.username),
    };
  }

  @Get(':id')
  async findOne(
    @Req() req: Request & { user: { username: string } },
    @Param('id', ParseIntPipe) id: number,
  ): Promise<BaseResponse<TransactionResponse>> {
    return {
      message: 'Data detail transaksi berhasil dimuat',
      data: await this.transactionService.findOne(req.user.username, id),
    };
  }

  @Put(':id')
  async update(
    @Req() req: Request & { user: { username: string } },
    @Param('id', ParseIntPipe) id: number,
    @Body() reqBody: UpdateTransactionDto,
  ): Promise<BaseResponse<TransactionResponse>> {
    return {
      message: 'Data transaksi berhasil diperbarui',
      data: await this.transactionService.update(
        req.user.username,
        id,
        reqBody,
      ),
    };
  }

  // @Delete(':id')
  // remove(@Param('id') id: string) {
  //   return this.transactionService.remove(+id);
  // }
}
