import { IsUUID, IsString, IsOptional, IsEmail, IsNotEmpty } from 'class-validator';

export class CreateWalletDto {
  @IsUUID()
  userId: string;

  @IsNotEmpty()
  @IsEmail() 
  email: string;

  @IsOptional()
  @IsString()
  currency?: string;
}
