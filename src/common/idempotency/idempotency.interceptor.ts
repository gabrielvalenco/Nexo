import {
  CallHandler,
  ExecutionContext,
  Injectable,
  NestInterceptor,
} from '@nestjs/common';
import { Observable, of } from 'rxjs';
import { tap } from 'rxjs/operators';
import { IdempotencyService } from './idempotency.service';

@Injectable()
export class IdempotencyInterceptor implements NestInterceptor {
  constructor(private readonly idem: IdempotencyService) {}

  async intercept(
    context: ExecutionContext,
    next: CallHandler,
  ): Promise<Observable<any>> {
    const req = context.switchToHttp().getRequest();
    const method = req.method.toUpperCase();
    if (method !== 'POST') return next.handle();
    const key = req.headers['idempotency-key'] as string | undefined;
    if (!key) return next.handle();

    const cached = await this.idem.get(key);
    if (cached) {
      return of(JSON.parse(cached));
    }
    return next.handle().pipe(
      tap(async (res) => {
        try {
          await this.idem.set(key, JSON.stringify(res));
        } catch {}
      }),
    );
  }
}
