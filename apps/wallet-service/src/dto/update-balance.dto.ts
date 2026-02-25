import { IsNumber, IsPositive, IsUUID } from 'class-validator';

export class UpdateBalanceDto {
  @IsUUID()
  userId: string;

  @IsNumber()
  @IsPositive()
  amount: number;
}