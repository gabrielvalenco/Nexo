import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Wallet } from '../../wallets/wallet.entity';
import { PixProvider } from './providers/pix.provider';
import { OpenPixProvider } from './providers/openpix.provider';
import { EfiProvider } from './providers/efi.provider';

@Injectable()
export class PixService {
  private provider: PixProvider;

  constructor(@InjectRepository(Wallet) private readonly walletRepo: Repository<Wallet>) {
    const choice = (process.env.PIX_PROVIDER || 'openpix').toLowerCase();
    this.provider = choice === 'efi' ? new EfiProvider() : new OpenPixProvider();
  }

  async createCharge(amount: number, recipientUserId: string, payerName?: string) {
    const recipient = await this.walletRepo.findOne({ where: { userId: recipientUserId } });
    if (!recipient) throw new Error('Recipient wallet not found');
    const result = await this.provider.createCharge(amount, payerName);
    return { ...result, recipientWalletId: recipient.id, amount };
  }

  async applyWebhookCredit(recipientUserId: string, amount: number) {
    const w = await this.walletRepo.findOne({ where: { userId: recipientUserId } });
    if (!w) return;
    w.balance = (Number(w.balance) + amount).toFixed(2);
    await this.walletRepo.save(w);
  }
}
