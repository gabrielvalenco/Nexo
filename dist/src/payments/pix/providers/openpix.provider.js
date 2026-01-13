"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.OpenPixProvider = void 0;
const axios_1 = require("axios");
class OpenPixProvider {
    async createCharge(amount, payerName) {
        const apiKey = process.env.OPENPIX_API_KEY;
        const url = (process.env.OPENPIX_BASE_URL || 'https://api.openpix.com.br') + '/api/v1/charge';
        if (!apiKey) {
            return { txid: `stub-${Date.now()}`, qrCode: '000201...STUB' };
        }
        const resp = await axios_1.default.post(url, { value: Math.round(amount * 100), correlationID: `nexo-${Date.now()}`, customer: { name: payerName || 'Nexo' } }, { headers: { Authorization: apiKey, 'Content-Type': 'application/json' } });
        const data = resp.data?.charge ?? resp.data;
        return { txid: data?.txid || data?.id, qrCode: data?.brCode || data?.qrCode?.base64 };
    }
}
exports.OpenPixProvider = OpenPixProvider;
//# sourceMappingURL=openpix.provider.js.map