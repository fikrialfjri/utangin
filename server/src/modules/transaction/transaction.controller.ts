import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  Req,
  UseGuards,
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

  // @Post()
  // create(@Body() createTransactionDto: CreateTransactionDto) {
  //   return this.transactionService.create(createTransactionDto);
  // }

  @Get()
  async findAll(
    @Req() req: Request & { user: { username: string } },
  ): Promise<BaseResponse<TransactionResponse[]>> {
    return {
      message: 'Data list transaksi berhasil dimuat',
      data: await this.transactionService.findAll(req.user.username),
    };
  }

  // @Get(':id')
  // findOne(@Param('id') id: string) {
  //   return this.transactionService.findOne(+id);
  // }

  // @Patch(':id')
  // update(@Param('id') id: string, @Body() updateTransactionDto: UpdateTransactionDto) {
  //   return this.transactionService.update(+id, updateTransactionDto);
  // }

  // @Delete(':id')
  // remove(@Param('id') id: string) {
  //   return this.transactionService.remove(+id);
  // }
}
