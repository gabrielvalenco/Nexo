import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Wallet } from './wallet.entity';

@Injectable()
export class WalletsService {
  constructor(@InjectRepository(Wallet) private repo: Repository<Wallet>) {}

  async create(userId: string): Promise<Wallet> {
    const wallet = this.repo.create({ userId, balance: '0.00' });
    return this.repo.save(wallet);
  }

  async findByUser(userId: string): Promise<Wallet> {
    const w = await this.repo.findOne({ where: { userId } });
    if (!w) throw new NotFoundException('Wallet not found');
    return w;
  }
}
