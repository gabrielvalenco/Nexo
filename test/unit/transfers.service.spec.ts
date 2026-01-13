import { TransfersService } from '../../src/transfers/transfers.service';
import { Repository } from 'typeorm';
import { Wallet } from '../../src/wallets/wallet.entity';

function mockDataSource(from: Wallet | null, to: Wallet | null, saves: Wallet[]) {
  return {
    createQueryRunner: () => ({
      connect: async () => {},
      startTransaction: async () => {},
      commitTransaction: async () => {},
      rollbackTransaction: async () => {},
      release: async () => {},
      manager: {
        findOne: async (_: any, opts: any) => {
          const id = opts.where.userId;
          if (id === 'a') return from;
          if (id === 'b') return to;
          return null;
        },
        save: async (_: any, w: Wallet) => {
          saves.push({ ...w });
          return w;
        },
      },
    }),
  } as any;
}

describe('TransfersService', () => {
  it('transfere com sucesso', async () => {
    const saves: Wallet[] = [];
    const dataSource = mockDataSource(
      { id: 'wa', userId: 'a', balance: '100.00', createdAt: new Date(), updatedAt: new Date() },
      { id: 'wb', userId: 'b', balance: '0.00', createdAt: new Date(), updatedAt: new Date() },
      saves,
    );
    const repo = {} as Repository<Wallet>;
    const service = new TransfersService(dataSource, repo);

    const res = await service.transfer('a', 'b', 25);
    expect(res).toEqual({ ok: true });
    expect(saves[0].balance).toBe('75.00');
    expect(saves[1].balance).toBe('25.00');
  });
});
