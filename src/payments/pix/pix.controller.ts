import { Body, Controller, Post, UseGuards, UseInterceptors } from '@nestjs/common';
import { ApiSecurity, ApiTags } from '@nestjs/swagger';
import { ApiKeyGuard } from '../../common/guards/api-key.guard';
import { IdempotencyInterceptor } from '../../common/idempotency/idempotency.interceptor';
import { PixService } from './pix.service';
import { CreatePixChargeDto } from './dto/create-charge.dto';

@ApiTags('pix')
@ApiSecurity('apiKey')
@UseGuards(ApiKeyGuard)
@Controller('pix')
export class PixController {
  constructor(private readonly service: PixService) {}

  @Post('charge')
  @UseInterceptors(IdempotencyInterceptor)
  createCharge(@Body() dto: CreatePixChargeDto) {
    return this.service.createCharge(dto.amount, dto.recipientUserId, dto.payerName);
  }
}
