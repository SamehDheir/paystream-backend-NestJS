import { Entity, PrimaryGeneratedColumn, Column, CreateDateColumn } from 'typeorm';

@Entity('transactions')
export class Transaction {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({ type: 'uuid' })
  userId: string;

  @Column()
  type: string; // 'WITHDRAW' or 'DEPOSIT'

  @Column({ type: 'decimal', precision: 19, scale: 4 })
  amount: number;

  @Column({ type: 'decimal', precision: 19, scale: 4 })
  balanceAfter: number;

  @CreateDateColumn()
  createdAt: Date;
}