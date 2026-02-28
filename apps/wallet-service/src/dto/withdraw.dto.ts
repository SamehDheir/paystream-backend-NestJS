import { ApiProperty } from '@nestjs/swagger';
import { IsNumber, IsPositive, IsUUID, Min } from 'class-validator';

export class WithdrawDto {
  @ApiProperty({ example: 100, description: 'The amount to be processed' })
  @IsNumber()
  @Min(1)
  amount: number;
}