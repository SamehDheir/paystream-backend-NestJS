import { Module } from '@nestjs/common';
import { LedgerServiceController } from './ledger-service.controller';
import { LedgerServiceService } from './ledger-service.service';
import { TypeOrmModule } from '@nestjs/typeorm/dist/typeorm.module';
import { Transaction } from './entities/transaction.entity';

@Module({
  imports: [
    TypeOrmModule.forRoot({
      type: 'postgres',
      host: 'localhost',
      port: 5432,
      username: 'postgres',
      password: 'password',
      database: 'paystream_db',
      entities: [Transaction],
      synchronize: true,
    }),
    TypeOrmModule.forFeature([Transaction]),
  ],
  controllers: [LedgerServiceController],
  providers: [LedgerServiceService],
})
export class LedgerServiceModule {}
