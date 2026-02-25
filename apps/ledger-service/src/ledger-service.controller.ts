import { Controller, Get, Param, UseGuards } from '@nestjs/common';
import { LedgerServiceService } from './ledger-service.service';
import { Payload } from '@nestjs/microservices/decorators/payload.decorator';
import { EventPattern } from '@nestjs/microservices/decorators/event-pattern.decorator';
import { JwtAuthGuard } from './jwt-auth.guard';
import { CurrentUser } from './user.decorator';

@UseGuards(JwtAuthGuard)
@Controller("ledger")
export class LedgerServiceController {
  constructor(private readonly ledgerServiceService: LedgerServiceService) {}

 @Get('my-history')
  async getMyHistory(@CurrentUser() user: any) {
    return await this.ledgerServiceService.getMyHistory(user.userId);
  }

  @EventPattern('transaction_created')
  async handleTransactionCreated(@Payload() data: any) {
    console.log('Received data:', data);
    await this.ledgerServiceService.createLog(data);
    console.log('The operation was successfully logged in the data log ✅');
  }
}
