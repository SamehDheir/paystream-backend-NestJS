import { Entity, PrimaryGeneratedColumn, Column, CreateDateColumn } from 'typeorm';

@Entity('transactions')
export class Transaction {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({ type: 'uuid' })
  userId: string;

  @Column({ type: 'uuid', nullable: true })
  referenceId: string; 
  
  @Column({ type: 'enum', enum: ['DEPOSIT', 'WITHDRAW', 'TRANSFER'] })
  type: string;

  @Column({ type: 'decimal', precision: 19, scale: 4 })
  amount: number;

  @Column({ type: 'decimal', precision: 19, scale: 4 })
  balanceAfter: number;

  @Column({ default: 'COMPLETED' })
  status: string;

  @CreateDateColumn()
  createdAt: Date;
}