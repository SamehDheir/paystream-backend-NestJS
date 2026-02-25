import { IsNumber, IsPositive, IsUUID } from 'class-validator';

export class TransferDto {
  @IsUUID()
  senderId: string;

  @IsUUID()
  receiverId: string;

  @IsNumber()
  @IsPositive()
  amount: number;
}