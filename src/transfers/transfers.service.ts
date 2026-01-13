import { BadRequestException, Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { DataSource, Repository } from 'typeorm';
import { Wallet } from '../wallets/wallet.entity';

function toDecimalString(n: number): string {
  return n.toFixed(2);
}

@Injectable()
export class TransfersService {
  constructor(
    private readonly dataSource: DataSource,
    @InjectRepository(Wallet) private readonly walletRepo: Repository<Wallet>,
  ) {}

  async transfer(fromUserId: string, toUserId: string, amount: number) {
    if (fromUserId === toUserId) throw new BadRequestException('Same wallet');
    if (amount <= 0) throw new BadRequestException('Invalid amount');

    const runner = this.dataSource.createQueryRunner();
    await runner.connect();
    await runner.startTransaction();
    try {
      const from = await runner.manager.findOne(Wallet, { where: { userId: fromUserId }, lock: { mode: 'pessimistic_write' } });
      const to = await runner.manager.findOne(Wallet, { where: { userId: toUserId }, lock: { mode: 'pessimistic_write' } });
      if (!from || !to) throw new BadRequestException('Wallet not found');

      const fromBalance = Number(from.balance);
      if (fromBalance < amount) throw new BadRequestException('Insufficient funds');

      from.balance = toDecimalString(fromBalance - amount);
      to.balance = toDecimalString(Number(to.balance) + amount);

      await runner.manager.save(Wallet, from);
      await runner.manager.save(Wallet, to);

      await runner.commitTransaction();
      return { ok: true };
    } catch (e) {
      await runner.rollbackTransaction();
      throw e;
    } finally {
      await runner.release();
    }
  }
}
