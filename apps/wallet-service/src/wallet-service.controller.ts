import { Controller, Post, Get, Body, Param } from '@nestjs/common';
import { WalletService } from './wallet-service.service';
import { UpdateBalanceDto } from './dto/update-balance.dto';
import { CreateWalletDto } from './dto/create-wallet.dto';
import { WithdrawDto } from './dto/withdraw.dto';

@Controller('wallets')
export class WalletController {
  constructor(private readonly walletService: WalletService) {}

  // POST /wallets
  @Post()
  async create(@Body() createWalletDto: CreateWalletDto) {
    return await this.walletService.create(createWalletDto.userId);
  }

  //
  @Post('deposit')
  async deposit(@Body() updateBalanceDto: UpdateBalanceDto) {
    return await this.walletService.addFunds(
      updateBalanceDto.userId,
      updateBalanceDto.amount,
    );
  }

  // GET /wallets/:userId
  @Get(':userId')
  async getBalance(@Param('userId') userId: string) {
    return await this.walletService.findOneByUserId(userId);
  }

  // POST /wallets/withdraw
  @Post('withdraw')
  async withdraw(@Body() withdrawDto: WithdrawDto) {
    return await this.walletService.withdraw(
      withdrawDto.userId,
      withdrawDto.amount,
    );
  }
}
