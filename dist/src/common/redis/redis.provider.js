"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.RedisProvider = exports.REDIS = void 0;
const ioredis_1 = require("ioredis");
exports.REDIS = Symbol('REDIS');
exports.RedisProvider = {
    provide: exports.REDIS,
    useFactory: () => {
        const host = process.env.REDIS_HOST || 'localhost';
        const port = Number(process.env.REDIS_PORT || 6379);
        const password = process.env.REDIS_PASSWORD || undefined;
        return new ioredis_1.default({ host, port, password, maxRetriesPerRequest: 1 });
    },
};
//# sourceMappingURL=redis.provider.js.map