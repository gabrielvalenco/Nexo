import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Wallet } from '../wallets/wallet.entity';
import { TransfersService } from './transfers.service';
import { TransfersController } from './transfers.controller';
import { IdempotencyModule } from '../common/idempotency/idempotency.module';

@Module({
  imports: [TypeOrmModule.forFeature([Wallet]), IdempotencyModule],
  providers: [TransfersService],
  controllers: [TransfersController],
})
export class TransfersModule {}
