import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Wallet } from './entities/wallet.entity';

@Injectable()
export class WalletService {
  constructor(
    @InjectRepository(Wallet)
    private walletRepository: Repository<Wallet>,
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
}