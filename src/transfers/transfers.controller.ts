import { Body, Controller, Post, UseGuards, UseInterceptors } from '@nestjs/common';
import { ApiSecurity, ApiTags } from '@nestjs/swagger';
import { ApiKeyGuard } from '../common/guards/api-key.guard';
import { TransfersService } from './transfers.service';
import { TransferDto } from './dto/transfer.dto';
import { IdempotencyInterceptor } from '../common/idempotency/idempotency.interceptor';

@ApiTags('transfers')
@ApiSecurity('apiKey')
@UseGuards(ApiKeyGuard)
@Controller('transfers')
export class TransfersController {
  constructor(private readonly service: TransfersService) {}

  @Post()
  @UseInterceptors(IdempotencyInterceptor)
  transfer(@Body() dto: TransferDto) {
    return this.service.transfer(dto.fromUserId, dto.toUserId, dto.amount);
  }
}
