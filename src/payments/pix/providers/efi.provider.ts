import axios from 'axios';
import { PixProvider, PixChargeResult } from './pix.provider';

export class EfiProvider implements PixProvider {
  async createCharge(amount: number, payerName?: string): Promise<PixChargeResult> {
    // Efí sandbox requires OAuth; for simplicity, stub if keys missing
    const clientId = process.env.EFI_CLIENT_ID;
    const clientSecret = process.env.EFI_CLIENT_SECRET;
    const certPath = process.env.EFI_CERT_PATH; // mTLS in real scenario
    if (!clientId || !clientSecret) {
      return { txid: `stub-${Date.now()}`, qrCode: '000201...STUB' };
    }
    // Minimal illustrative flow (not production-ready): obtain token and create charge
    const base = process.env.EFI_BASE_URL || 'https://api.efipay.com.br';
    const tokenResp = await axios.post(`${base}/oauth/token`, {
      grant_type: 'client_credentials',
      client_id: clientId,
      client_secret: clientSecret,
    });
    const accessToken = tokenResp.data?.access_token;
    const chargeResp = await axios.post(
      `${base}/pix/charge`,
      { valor: amount, solicitante: payerName || 'Nexo' },
      { headers: { Authorization: `Bearer ${accessToken}` } },
    );
    const data = chargeResp.data;
    return { txid: data?.txid, qrCode: data?.qrcode || data?.brcode };
  }
}
