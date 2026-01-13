import axios from 'axios';
import { PixProvider, PixChargeResult } from './pix.provider';

export class OpenPixProvider implements PixProvider {
  async createCharge(amount: number, payerName?: string): Promise<PixChargeResult> {
    const apiKey = process.env.OPENPIX_API_KEY;
    const url = (process.env.OPENPIX_BASE_URL || 'https://api.openpix.com.br') + '/api/v1/charge';
    if (!apiKey) {
      // fallback stub for dev without keys
      return { txid: `stub-${Date.now()}`, qrCode: '000201...STUB' };
    }
    const resp = await axios.post(
      url,
      { value: Math.round(amount * 100), correlationID: `nexo-${Date.now()}`, customer: { name: payerName || 'Nexo' } },
      { headers: { Authorization: apiKey, 'Content-Type': 'application/json' } },
    );
    const data = resp.data?.charge ?? resp.data;
    return { txid: data?.txid || data?.id, qrCode: data?.brCode || data?.qrCode?.base64 };
  }
}
