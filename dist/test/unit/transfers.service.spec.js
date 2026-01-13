"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const transfers_service_1 = require("../../src/transfers/transfers.service");
function mockDataSource(from, to, saves) {
    return {
        createQueryRunner: () => ({
            connect: async () => { },
            startTransaction: async () => { },
            commitTransaction: async () => { },
            rollbackTransaction: async () => { },
            release: async () => { },
            manager: {
                findOne: async (_, opts) => {
                    const id = opts.where.userId;
                    if (id === 'a')
                        return from;
                    if (id === 'b')
                        return to;
                    return null;
                },
                save: async (_, w) => {
                    saves.push({ ...w });
                    return w;
                },
            },
        }),
    };
}
describe('TransfersService', () => {
    it('transfere com sucesso', async () => {
        const saves = [];
        const dataSource = mockDataSource({ id: 'wa', userId: 'a', balance: '100.00', createdAt: new Date(), updatedAt: new Date() }, { id: 'wb', userId: 'b', balance: '0.00', createdAt: new Date(), updatedAt: new Date() }, saves);
        const repo = {};
        const service = new transfers_service_1.TransfersService(dataSource, repo);
        const res = await service.transfer('a', 'b', 25);
        expect(res).toEqual({ ok: true });
        expect(saves[0].balance).toBe('75.00');
        expect(saves[1].balance).toBe('25.00');
    });
});
//# sourceMappingURL=transfers.service.spec.js.map