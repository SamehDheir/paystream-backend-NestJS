import { Controller, Post, Get, Body, Param } from '@nestjs/common';
import { WalletService } from './wallet-service.service';
import { UpdateBalanceDto } from './dto/update-balance.dto';
import { CreateWalletDto } from './dto/create-wallet.dto';

@Controller('wallets')
export class WalletController {
  constructor(private readonly walletService: WalletService) {}

  // POST /wallets
  @Post()
  async create(@Body() createWalletDto: CreateWalletDto) {
    return await this.walletService.create(createWalletDto.userId);
  }

  // سنضيف عملية الإيداع (Deposit) للتجربة
  @Post('deposit')
  async deposit(@Body() updateBalanceDto: UpdateBalanceDto) {
    return await this.walletService.addFunds(updateBalanceDto.userId, updateBalanceDto.amount);
  }

  // GET /wallets/:userId
  @Get(':userId')
  async getBalance(@Param('userId') userId: string) {
    return await this.walletService.findOneByUserId(userId);
  }
}