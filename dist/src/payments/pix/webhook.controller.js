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
exports.PixWebhookController = void 0;
const common_1 = require("@nestjs/common");
const swagger_1 = require("@nestjs/swagger");
const pix_service_1 = require("./pix.service");
let PixWebhookController = class PixWebhookController {
    constructor(service) {
        this.service = service;
    }
    async handle(headers, body) {
        const amount = Number(body?.value || body?.amount || 0) / (body?.value ? 100 : 1);
        const recipientUserId = body?.recipientUserId || body?.customer?.name || 'user_dest';
        await this.service.applyWebhookCredit(recipientUserId, amount);
        return { ok: true };
    }
};
exports.PixWebhookController = PixWebhookController;
__decorate([
    (0, common_1.Post)(),
    __param(0, (0, common_1.Headers)()),
    __param(1, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, Object]),
    __metadata("design:returntype", Promise)
], PixWebhookController.prototype, "handle", null);
exports.PixWebhookController = PixWebhookController = __decorate([
    (0, swagger_1.ApiTags)('pix'),
    (0, common_1.Controller)('pix/webhook'),
    __metadata("design:paramtypes", [pix_service_1.PixService])
], PixWebhookController);
//# sourceMappingURL=webhook.controller.js.map