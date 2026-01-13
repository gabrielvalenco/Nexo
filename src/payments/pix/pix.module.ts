import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Wallet } from '../../wallets/wallet.entity';
import { PixService } from './pix.service';
import { PixController } from './pix.controller';
import { PixWebhookController } from './webhook.controller';
import { IdempotencyModule } from '../../common/idempotency/idempotency.module';

@Module({
  imports: [TypeOrmModule.forFeature([Wallet]), IdempotencyModule],
  providers: [PixService],
  controllers: [PixController, PixWebhookController],
})
export class PixModule {}
