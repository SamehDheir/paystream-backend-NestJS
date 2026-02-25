import { IsNumber, IsPositive, IsUUID, Min } from 'class-validator';

export class WithdrawDto {
  @IsUUID()
  userId: string;

  @IsNumber()
  @Min(1)
  amount: number;
}