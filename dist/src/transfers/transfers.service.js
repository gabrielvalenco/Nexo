"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
var __param = (this && this.__param) || function (paramIndex, decorator) {
    return function (target, key) { decorator(target, key, paramIndex); }
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.TransfersService = void 0;
const common_1 = require("@nestjs/common");
const typeorm_1 = require("@nestjs/typeorm");
const typeorm_2 = require("typeorm");
const wallet_entity_1 = require("../wallets/wallet.entity");
function toDecimalString(n) {
    return n.toFixed(2);
}
let TransfersService = class TransfersService {
    constructor(dataSource, walletRepo) {
        this.dataSource = dataSource;
        this.walletRepo = walletRepo;
    }
    async transfer(fromUserId, toUserId, amount) {
        if (fromUserId === toUserId)
            throw new common_1.BadRequestException('Same wallet');
        if (amount <= 0)
            throw new common_1.BadRequestException('Invalid amount');
        const runner = this.dataSource.createQueryRunner();
        await runner.connect();
        await runner.startTransaction();
        try {
            const from = await runner.manager.findOne(wallet_entity_1.Wallet, { where: { userId: fromUserId }, lock: { mode: 'pessimistic_write' } });
            const to = await runner.manager.findOne(wallet_entity_1.Wallet, { where: { userId: toUserId }, lock: { mode: 'pessimistic_write' } });
            if (!from || !to)
                throw new common_1.BadRequestException('Wallet not found');
            const fromBalance = Number(from.balance);
            if (fromBalance < amount)
                throw new common_1.BadRequestException('Insufficient funds');
            from.balance = toDecimalString(fromBalance - amount);
            to.balance = toDecimalString(Number(to.balance) + amount);
            await runner.manager.save(wallet_entity_1.Wallet, from);
            await runner.manager.save(wallet_entity_1.Wallet, to);
            await runner.commitTransaction();
            return { ok: true };
        }
        catch (e) {
            await runner.rollbackTransaction();
            throw e;
        }
        finally {
            await runner.release();
        }
    }
};
exports.TransfersService = TransfersService;
exports.TransfersService = TransfersService = __decorate([
    (0, common_1.Injectable)(),
    __param(1, (0, typeorm_1.InjectRepository)(wallet_entity_1.Wallet)),
    __metadata("design:paramtypes", [typeorm_2.DataSource,
        typeorm_2.Repository])
], TransfersService);
//# sourceMappingURL=transfers.service.js.map