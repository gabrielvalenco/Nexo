import { Body, Controller, Get, Param, Post, UseGuards } from '@nestjs/common';
import { ApiTags, ApiSecurity } from '@nestjs/swagger';
import { ApiKeyGuard } from '../common/guards/api-key.guard';
import { WalletsService } from './wallets.service';
import { CreateWalletDto } from './dto/create-wallet.dto';

@ApiTags('wallets')
@ApiSecurity('apiKey')
@UseGuards(ApiKeyGuard)
@Controller('wallets')
export class WalletsController {
  constructor(private readonly service: WalletsService) {}

  @Post()
  create(@Body() dto: CreateWalletDto) {
    return this.service.create(dto.userId);
  }

  @Get(':userId')
  get(@Param('userId') userId: string) {
    return this.service.findByUser(userId);
  }
}
