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
exports.PixService = void 0;
const common_1 = require("@nestjs/common");
const typeorm_1 = require("@nestjs/typeorm");
const typeorm_2 = require("typeorm");
const wallet_entity_1 = require("../../wallets/wallet.entity");
const openpix_provider_1 = require("./providers/openpix.provider");
const efi_provider_1 = require("./providers/efi.provider");
let PixService = class PixService {
    constructor(walletRepo) {
        this.walletRepo = walletRepo;
        const choice = (process.env.PIX_PROVIDER || 'openpix').toLowerCase();
        this.provider = choice === 'efi' ? new efi_provider_1.EfiProvider() : new openpix_provider_1.OpenPixProvider();
    }
    async createCharge(amount, recipientUserId, payerName) {
        const recipient = await this.walletRepo.findOne({ where: { userId: recipientUserId } });
        if (!recipient)
            throw new Error('Recipient wallet not found');
        const result = await this.provider.createCharge(amount, payerName);
        return { ...result, recipientWalletId: recipient.id, amount };
    }
    async applyWebhookCredit(recipientUserId, amount) {
        const w = await this.walletRepo.findOne({ where: { userId: recipientUserId } });
        if (!w)
            return;
        w.balance = (Number(w.balance) + amount).toFixed(2);
        await this.walletRepo.save(w);
    }
};
exports.PixService = PixService;
exports.PixService = PixService = __decorate([
    (0, common_1.Injectable)(),
    __param(0, (0, typeorm_1.InjectRepository)(wallet_entity_1.Wallet)),
    __metadata("design:paramtypes", [typeorm_2.Repository])
], PixService);
//# sourceMappingURL=pix.service.js.map