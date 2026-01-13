import { Inject, Injectable } from '@nestjs/common';
import type Redis from 'ioredis';
import { REDIS } from '../redis/redis.provider';

@Injectable()
export class IdempotencyService {
  constructor(@Inject(REDIS) private readonly redis: Redis) {}

  async get(key: string): Promise<string | null> {
    return this.redis.get(this.formatKey(key));
  }

  async set(key: string, value: string, ttlSeconds = 300): Promise<void> {
    await this.redis.set(this.formatKey(key), value, 'EX', ttlSeconds, 'NX');
  }

  private formatKey(key: string) {
    return `idem:${key}`;
  }
}
