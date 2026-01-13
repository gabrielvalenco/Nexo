import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ConfigModule } from '@nestjs/config';
import { HealthController } from './health.controller';
import { Wallet } from './wallets/wallet.entity';
import { WalletsModule } from './wallets/wallets.module';
import { TransfersModule } from './transfers/transfers.module';
import { PixModule } from './payments/pix/pix.module';
import { IdempotencyModule } from './common/idempotency/idempotency.module';

@Module({
  imports: [
    ConfigModule.forRoot({ isGlobal: true }),
    TypeOrmModule.forRoot({
      type: 'postgres',
      host: process.env.DB_HOST || 'localhost',
      port: Number(process.env.DB_PORT || 5432),
      username: process.env.DB_USER || 'postgres',
      password: process.env.DB_PASSWORD || 'postgres',
      database: process.env.DB_NAME || 'nexo',
      entities: [Wallet],
      synchronize: true,
      logging: false,
    }),
    WalletsModule,
    TransfersModule,
    PixModule,
    IdempotencyModule,
  ],
  controllers: [HealthController],
})
export class AppModule {}
