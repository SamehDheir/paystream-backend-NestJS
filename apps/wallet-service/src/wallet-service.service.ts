import {
  BadRequestException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Wallet } from './entities/wallet.entity';
import { DataSource } from 'typeorm';

@Injectable()
export class WalletService {
  constructor(
    @InjectRepository(Wallet)
    private walletRepository: Repository<Wallet>,
    private dataSource: DataSource,
  ) {}

  // Create a new wallet for a user
  async create(userId: string) {
    const newWallet = this.walletRepository.create({
      userId,
      balance: 0,
    });
    return await this.walletRepository.save(newWallet);
  }

  // Add funds to the wallet
  async addFunds(userId: string, amount: number) {
    const wallet = await this.findOneByUserId(userId);

    wallet.balance = Number(wallet.balance) + amount;

    return await this.walletRepository.save(wallet);
  }

  // Get wallet and balance data
  async findOneByUserId(userId: string) {
    const wallet = await this.walletRepository.findOne({ where: { userId } });
    if (!wallet) {
      throw new NotFoundException('The wallet does not exist for this user');
    }
    return wallet;
  }

  // Atomically processes a wallet withdrawal with balance validation and rollback safety
  async withdraw(userId: string, amount: number) {
    // Starting the Transaction
    const queryRunner = this.dataSource.createQueryRunner();
    await queryRunner.connect();
    await queryRunner.startTransaction();

    try {
      // 1. Search for the wallet within the transaction
      const wallet = await queryRunner.manager.findOne(Wallet, {
        where: { userId },
        lock: { mode: 'pessimistic_write' }, // Lock the row to prevent concurrent modifications
      });

      if (!wallet) throw new NotFoundException('The wallet is not found.');

      // 2. Checking the adequacy of the balance
      const currentBalance = Number(wallet.balance);
      if (currentBalance < amount) {
        throw new BadRequestException('Insufficient funds');
      }

      // 3. Deduct the amount
      wallet.balance = currentBalance - amount;

      // 4. Save
      await queryRunner.manager.save(wallet);

      // Confirm the process
      await queryRunner.commitTransaction();
      return wallet;
    } catch (err) {
      // If anything goes wrong, everything is rolled back
      await queryRunner.rollbackTransaction();
      throw err;
    } finally {
      // Close the connection
      await queryRunner.release();
    }
  }
}
