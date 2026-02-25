import { Controller, Get } from '@nestjs/common';
import { LedgerServiceService } from './ledger-service.service';
import { Payload } from '@nestjs/microservices/decorators/payload.decorator';
import { EventPattern } from '@nestjs/microservices/decorators/event-pattern.decorator';

@Controller()
export class LedgerServiceController {
  constructor(private readonly ledgerServiceService: LedgerServiceService) {}

  @EventPattern('transaction_created')
  async handleTransactionCreated(@Payload() data: any) {
    console.log('Received data:', data);
    await this.ledgerServiceService.createLog(data);
    console.log('The operation was successfully logged in the data log ✅');
  }
}
