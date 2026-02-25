import { Entity, PrimaryGeneratedColumn, Column, UpdateDateColumn, CreateDateColumn, VersionColumn } from 'typeorm';

@Entity('wallets')
export class Wallet {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({ type: 'uuid', unique: true })
  userId: string;

  @Column({ type: 'decimal', precision: 19, scale: 4, default: 0 })
  balance: number;

  @Column({ default: 'USD' })
  currency: string;

  @VersionColumn()
  version: number;

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;
}