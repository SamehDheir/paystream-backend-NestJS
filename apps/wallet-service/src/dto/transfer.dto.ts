import { IsNumber, IsPositive, IsString, IsUUID } from 'class-validator';

export class TransferDto {

  @IsUUID()
  receiverId: string;

  @IsNumber()
  @IsPositive()
  amount: number;
}