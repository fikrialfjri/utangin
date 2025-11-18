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
  Query,
} from '@nestjs/common';
import { TransactionService } from './transaction.service';
import { CreateTransactionDto } from './dto/create-transaction.dto';
import { UpdateTransactionDto } from './dto/update-transaction.dto';
import { BaseResponse } from 'src/common/interfaces/base-response.interface';
import {
  GroupedTransactionResponse,
  TransactionResponse,
} from './responses/transaction.response';
import { JwtAuthGuard } from 'src/common/auth/guards/logged-in.guard';
import { GetTransactionDto } from './dto/get-transaction.dto';

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
    @Query() reqParams: GetTransactionDto,
  ): Promise<
    BaseResponse<TransactionResponse[] | GroupedTransactionResponse[]>
  > {
    const { page, limit } = reqParams;

    const result = await this.transactionService.findAll(
      req.user.username,
      reqParams,
    );

    return {
      message: 'Data list transaksi berhasil dimuat',
      data: result.data,
      meta:
        page && limit
          ? { page, limit, total: result.total }
          : { page: 1, limit: result.total, total: result.total },
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

  @Delete(':id')
  async remove(
    @Req() req: Request & { user: { username: string } },
    @Param('id', ParseIntPipe) id: number,
  ): Promise<BaseResponse<TransactionResponse>> {
    return {
      message: 'Data transaksi berhasil dihapus',
      data: await this.transactionService.remove(req.user.username, id),
    };
  }
}
