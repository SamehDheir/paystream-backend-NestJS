import {
  BadRequestException,
  Inject,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Wallet } from './entities/wallet.entity';
import { DataSource } from 'typeorm';
import { ClientProxy } from '@nestjs/microservices/client/client-proxy';
import { TransferDto } from './dto/transfer.dto';

@Injectable()
export class WalletService {
  constructor(
    @Inject('LEDGER_SERVICE') private client: ClientProxy,
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
    const updatedWallet = await this.walletRepository.save(wallet);

    // Send the news to Ledger
    this.client.emit('transaction_created', {
      userId,
      amount,
      type: 'DEPOSIT',
      balanceAfter: updatedWallet.balance,
      createdAt: new Date(),
    });

    return updatedWallet;
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
      const updatedWallet = await queryRunner.manager.save(wallet);

      // Confirm the process
      this.client.emit('transaction_created', {
        userId,
        amount,
        type: 'WITHDRAW',
        balanceAfter: updatedWallet.balance,
        createdAt: new Date(),
      });

      return updatedWallet;
    } catch (err) {
      // If anything goes wrong, everything is rolled back
      await queryRunner.rollbackTransaction();
      throw err;
    } finally {
      // Close the connection
      await queryRunner.release();
    }
  }

  // Transfer money between wallets
  async transfer(senderId: string, transferDto: TransferDto) {
    const { receiverId, amount } = transferDto;

    if (senderId === receiverId) {
      throw new BadRequestException('Cannot transfer money to the same wallet');
    }

    const queryRunner = this.dataSource.createQueryRunner();
    await queryRunner.connect();
    await queryRunner.startTransaction();

    try {
      // 1. Bring the sender's wallet with a lock to prevent any simultaneous modification
      const sender = await queryRunner.manager.findOne(Wallet, {
        where: { userId: senderId },
        lock: { mode: 'pessimistic_write' },
      });

      if (!sender) throw new NotFoundException('Sender wallet not found');

      // 2. Check balance
      const senderBalance = Number(sender.balance);
      if (senderBalance < amount) {
        throw new BadRequestException('Insufficient funds');
      }

      // 3. Bring the wallet of the future with a lock
      const receiver = await queryRunner.manager.findOne(Wallet, {
        where: { userId: receiverId },
        lock: { mode: 'pessimistic_write' },
      });

      if (!receiver) throw new NotFoundException('Receiver wallet not found');

      // 4. Performing the calculation
      sender.balance = senderBalance - amount;
      receiver.balance = Number(receiver.balance) + amount;

      // 5. Save both sides
      await queryRunner.manager.save([sender, receiver]);

      // 6. Confirm the operation in the database
      await queryRunner.commitTransaction();

      // 7. Sending events to the Ledger (two notifications: one for the sender and one for the receiver)
      this.client.emit('transaction_created', {
        userId: senderId,
        amount: -amount, // Negative because it is an opponent
        type: 'TRANSFER_OUT',
        balanceAfter: sender.balance,
        referenceId: receiverId,
      });

      this.client.emit('transaction_created', {
        userId: receiverId,
        amount: amount, // Positive because it is a deposit
        type: 'TRANSFER_IN',
        balanceAfter: receiver.balance,
        referenceId: senderId,
      });

      return { message: 'Transfer completed successfully', amount };
    } catch (err) {
      // If anything goes wrong, undo everything
      await queryRunner.rollbackTransaction();
      throw err;
    } finally {
      // Close the connection
      await queryRunner.release();
    }
  }
}
