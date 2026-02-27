import { Injectable, Logger } from '@nestjs/common';
import { Repository } from 'typeorm';
import { Transaction } from './entities/transaction.entity';
import { InjectRepository } from '@nestjs/typeorm/dist/common/typeorm.decorators';

@Injectable()
export class LedgerServiceService {
  private readonly logger = new Logger(LedgerServiceService.name);
  constructor(
    @InjectRepository(Transaction)
    private transactionRepository: Repository<Transaction>,
  ) {}

  //
  async createLog(data: Partial<Transaction>) {
    try {
      const log = this.transactionRepository.create({
        userId: data.userId,
        type: data.type,
        amount: data.amount,
        balanceAfter: data.balanceAfter,
      });

      const savedLog = await this.transactionRepository.save(log);
      this.logger.log(`✅ Transaction saved: ${savedLog.id}`);
      return savedLog;
    } catch (error) {
      this.logger.error('❌ Database Save Error', error.stack);
    }
  }
  //
  async getMyHistory(userId: string) {
    return await this.transactionRepository.find({
      where: { userId },
      order: { createdAt: 'DESC' },
    });
  }
}
