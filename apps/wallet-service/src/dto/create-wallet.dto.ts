import { IsUUID, IsString, IsOptional } from 'class-validator';

export class CreateWalletDto {
  @IsUUID()
  userId: string;

  @IsOptional()
  @IsString()
  currency?: string;
}
