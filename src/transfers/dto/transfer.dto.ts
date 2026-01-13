import { ApiProperty } from '@nestjs/swagger';
import { IsString, Length, IsNumber, Min } from 'class-validator';

export class TransferDto {
  @ApiProperty({ example: 'user_a' })
  @IsString()
  @Length(3, 128)
  fromUserId!: string;

  @ApiProperty({ example: 'user_b' })
  @IsString()
  @Length(3, 128)
  toUserId!: string;

  @ApiProperty({ example: 100.5 })
  @IsNumber()
  @Min(0.01)
  amount!: number;
}
