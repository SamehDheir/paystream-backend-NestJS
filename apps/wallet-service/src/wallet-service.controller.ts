import { Controller, Post, Get, Body, Param, UseGuards } from '@nestjs/common';
import { WalletService } from './wallet-service.service';
import { JwtAuthGuard } from './jwt-auth.guard';
import { CurrentUser } from './user.decorator';
import { TransferDto } from './dto/transfer.dto';
import { WithdrawDto } from './dto/withdraw.dto';

@UseGuards(JwtAuthGuard)
@Controller('wallets')
export class WalletController {
  constructor(private readonly walletService: WalletService) {}

  // POST /wallets
  @Post()
  async create(@CurrentUser() user: any) {
    return await this.walletService.create(user.userId);
  }

  //
  @Post('deposit')
  async deposit(@CurrentUser() user: any, @Body() body: { amount: number }) {
    return await this.walletService.addFunds(user.userId, body.amount);
  }

  // GET /wallets/:userId
  @Get('my-balance')
  async getBalance(@CurrentUser() user: any) {
    return await this.walletService.findOneByUserId(user.userId);
  }

  // POST /wallets/withdraw
  @Post('withdraw')
  async withdraw(@CurrentUser() user: any, @Body() withdrawDto: WithdrawDto) {
    return await this.walletService.withdraw(user.userId, withdrawDto.amount);
  }

  // POST /wallets/transfer
  @Post('transfer')
  async transfer(@CurrentUser() user: any, @Body() transferDto: TransferDto) {
    return await this.walletService.transfer(user.userId, transferDto);
  }
}
