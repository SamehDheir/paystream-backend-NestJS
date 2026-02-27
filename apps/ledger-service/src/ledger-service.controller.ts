import { Controller, Get, Param, UseGuards } from '@nestjs/common';
import { LedgerServiceService } from './ledger-service.service';
import { EventPattern, Payload } from '@nestjs/microservices';
import { JwtAuthGuard } from './jwt-auth.guard';
import { CurrentUser } from './user.decorator';
import {
  ApiCookieAuth,
  ApiOperation,
  ApiResponse,
  ApiTags,
} from '@nestjs/swagger';

@ApiTags('Ledger (Transaction History)')
@ApiCookieAuth()
@Controller('ledger')
export class LedgerServiceController {
  constructor(private readonly ledgerServiceService: LedgerServiceService) {}

@EventPattern('transaction_created')
async handleTransactionCreated(@Payload() data: any) {
  console.log('Incoming Event Data:', data); 

  await this.ledgerServiceService.createLog({
    userId: data.userId,
    type: data.type,
    amount: data.amount,
    balanceAfter: data.balanceAfter,
  });
}


  @UseGuards(JwtAuthGuard)
  @ApiOperation({
    summary: 'Get transaction history for the current logged-in user',
  })
  @ApiResponse({
    status: 200,
    description: 'Returns a list of all user transactions',
  })
  @Get('my-history')
  async getMyHistory(@CurrentUser() user: any) {
    return await this.ledgerServiceService.getMyHistory(user.userId);
  }
}
