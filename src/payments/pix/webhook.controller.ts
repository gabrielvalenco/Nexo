import { Body, Controller, Headers, Post } from '@nestjs/common';
import { ApiTags } from '@nestjs/swagger';
import { PixService } from './pix.service';

@ApiTags('pix')
@Controller('pix/webhook')
export class PixWebhookController {
  constructor(private readonly service: PixService) {}

  @Post()
  async handle(@Headers() headers: Record<string, string>, @Body() body: any) {
    // Example payload normalization; providers differ
    const amount = Number(body?.value || body?.amount || 0) / (body?.value ? 100 : 1);
    const recipientUserId = body?.recipientUserId || body?.customer?.name || 'user_dest';
    await this.service.applyWebhookCredit(recipientUserId, amount);
    return { ok: true };
  }
}
