import { Controller, Post, Get, Body, Param, UseGuards } from '@nestjs/common';
import { WalletService } from './wallet-service.service';
import { JwtAuthGuard } from './jwt-auth.guard';
import { CurrentUser } from './user.decorator';
import { TransferDto } from './dto/transfer.dto';
import { WithdrawDto } from './dto/withdraw.dto';
import {
  ApiCookieAuth,
  ApiOperation,
  ApiResponse,
  ApiTags,
} from '@nestjs/swagger';

@ApiTags('Wallet Operations')
@ApiCookieAuth()
@UseGuards(JwtAuthGuard)
@Controller('wallets')
export class WalletController {
  constructor(private readonly walletService: WalletService) {}

  // POST /wallets
  @ApiOperation({ summary: 'Initialize a new wallet for the current user' })
  @ApiResponse({ status: 201, description: 'Wallet created successfully' })
  @Post()
  async create(@CurrentUser() user: any) {
    return await this.walletService.create(user.userId);
  }

  //
  @ApiOperation({ summary: "Deposit funds to the current user's wallet" })
  @Post('deposit')
  async deposit(@CurrentUser() user: any, @Body() body: { amount: number }) {
    return await this.walletService.addFunds(user.userId, body.amount);
  }

  // GET /wallets/:userId
  @ApiOperation({ summary: 'Get current balance of the logged-in user' })
  @Get('my-balance')
  async getBalance(@CurrentUser() user: any) {
    return await this.walletService.findOneByUserId(user.userId);
  }

  // POST /wallets/withdraw
  @ApiOperation({ summary: "Withdraw funds from the current user's wallet" })
  @Post('withdraw')
  async withdraw(@CurrentUser() user: any, @Body() withdrawDto: WithdrawDto) {
    return await this.walletService.withdraw(user.userId, withdrawDto.amount);
  }

  // POST /wallets/transfer
  @ApiOperation({
    summary: 'Transfer funds from the current user to another user',
  })
  @Post('transfer')
  async transfer(@CurrentUser() user: any, @Body() transferDto: TransferDto) {
    return await this.walletService.transfer(user.userId, transferDto);
  }
}
