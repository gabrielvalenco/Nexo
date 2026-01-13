import { ApiProperty } from '@nestjs/swagger';
import { IsString, Length } from 'class-validator';

export class CreateWalletDto {
  @ApiProperty({ example: 'user_123' })
  @IsString()
  @Length(3, 128)
  userId!: string;
}
