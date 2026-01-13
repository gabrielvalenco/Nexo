export interface PixChargeResult {
  txid: string;
  qrCode: string; // payload or image URL
}

export interface PixProvider {
  createCharge(amount: number, payerName?: string): Promise<PixChargeResult>;
  validateWebhookSignature?(headers: Record<string, string>, body: any): Promise<boolean>;
}
