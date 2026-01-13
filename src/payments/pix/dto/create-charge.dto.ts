import { ApiProperty } from '@nestjs/swagger';
import { IsNumber, Min, IsString, Length, IsOptional } from 'class-validator';

export class CreatePixChargeDto {
  @ApiProperty({ example: 50.0 })
  @IsNumber()
  @Min(0.01)
  amount!: number;

  @ApiProperty({ example: 'user_dest' })
  @IsString()
  @Length(3, 128)
  recipientUserId!: string;

  @ApiProperty({ example: 'Cliente Teste', required: false })
  @IsOptional()
  @IsString()
  payerName?: string;
}
