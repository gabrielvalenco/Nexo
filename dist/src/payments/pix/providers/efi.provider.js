"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.EfiProvider = void 0;
const axios_1 = require("axios");
class EfiProvider {
    async createCharge(amount, payerName) {
        const clientId = process.env.EFI_CLIENT_ID;
        const clientSecret = process.env.EFI_CLIENT_SECRET;
        const certPath = process.env.EFI_CERT_PATH;
        if (!clientId || !clientSecret) {
            return { txid: `stub-${Date.now()}`, qrCode: '000201...STUB' };
        }
        const base = process.env.EFI_BASE_URL || 'https://api.efipay.com.br';
        const tokenResp = await axios_1.default.post(`${base}/oauth/token`, {
            grant_type: 'client_credentials',
            client_id: clientId,
            client_secret: clientSecret,
        });
        const accessToken = tokenResp.data?.access_token;
        const chargeResp = await axios_1.default.post(`${base}/pix/charge`, { valor: amount, solicitante: payerName || 'Nexo' }, { headers: { Authorization: `Bearer ${accessToken}` } });
        const data = chargeResp.data;
        return { txid: data?.txid, qrCode: data?.qrcode || data?.brcode };
    }
}
exports.EfiProvider = EfiProvider;
//# sourceMappingURL=efi.provider.js.map