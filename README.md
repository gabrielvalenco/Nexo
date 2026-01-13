# Nexo Fintech API

A production-inspired, Brazil-focused payments gateway and fintech core built with NestJS. It implements digital wallets, peer-to-peer transfers, and PIX charge generation with real sandbox providers (OpenPix/Efí), emphasizing security, idempotency, and ACID transactions.

## Architecture Diagram

```mermaid
flowchart LR
  U[Client] -->|REST| API[NestJS API]
  API --> W[Wallets]
  API --> T[Transfers (ACID)]
  API --> P[PIX]
  T -->|QueryRunner| DB[(Postgres)]
  W --> DB
  API -->|Idempotency-Key| R[(Redis)]
  P --> OP[(OpenPix / Efi Sandbox)]
  OP -->|Webhook| API
  API -->|Credit| W
  API --> DOCS[Swagger /docs]
```

## Key Features
- Digital Wallets: create and query user wallets with accurate decimal balances.
- Money Transfers (ACID): transactional transfer flow using TypeORM `QueryRunner` and pessimistic locks.
- PIX Integration: dynamic QR code charges via OpenPix or Efí providers; webhook to credit wallets on payment confirmation.
- Idempotency: `Idempotency-Key` header cached on Redis to avoid double-processing when users click twice.
- Security: API Key guard (`x-api-key`), strict validation with DTOs (`class-validator`), logging and error interceptors.
- Documentation: Swagger UI at `/docs` with security schemes.
- Docker: `docker-compose.yml` spins API, Postgres, and Redis with one command.
- Tests: Unit tests for core services and an E2E sanity check.

## Tech Stack
- NestJS core (`@nestjs/common`, `@nestjs/core`)
- TypeORM with Postgres (`typeorm`, `pg`, `@nestjs/typeorm`)
- Redis via `ioredis` for idempotency
- Axios for provider HTTP calls
- Validation: `class-validator` and `class-transformer`
- API Docs: `@nestjs/swagger`
- Testing: Jest, `@nestjs/testing`, Supertest

## Architecture Overview
- Bootstrap and Config: [main.ts](file:///c:/Users/gabri/Documents/trae_projects/Nexo/src/main.ts), [app.module.ts](file:///c:/Users/gabri/Documents/trae_projects/Nexo/src/app.module.ts)
- Common:
  - Guards: API Key [api-key.guard.ts](file:///c:/Users/gabri/Documents/trae_projects/Nexo/src/common/guards/api-key.guard.ts)
  - Interceptors: Logging [logging.interceptor.ts](file:///c:/Users/gabri/Documents/trae_projects/Nexo/src/common/interceptors/logging.interceptor.ts) and Errors [errors.interceptor.ts](file:///c:/Users/gabri/Documents/trae_projects/Nexo/src/common/interceptors/errors.interceptor.ts)
  - Idempotency: Redis provider [redis.provider.ts](file:///c:/Users/gabri/Documents/trae_projects/Nexo/src/common/redis/redis.provider.ts), service [idempotency.service.ts](file:///c:/Users/gabri/Documents/trae_projects/Nexo/src/common/idempotency/idempotency.service.ts), interceptor [idempotency.interceptor.ts](file:///c:/Users/gabri/Documents/trae_projects/Nexo/src/common/idempotency/idempotency.interceptor.ts)
- Wallets: Entity [wallet.entity.ts](file:///c:/Users/gabri/Documents/trae_projects/Nexo/src/wallets/wallet.entity.ts), Service [wallets.service.ts](file:///c:/Users/gabri/Documents/trae_projects/Nexo/src/wallets/wallets.service.ts), Controller [wallets.controller.ts](file:///c:/Users/gabri/Documents/trae_projects/Nexo/src/wallets/wallets.controller.ts)
- Transfers: Service [transfers.service.ts](file:///c:/Users/gabri/Documents/trae_projects/Nexo/src/transfers/transfers.service.ts), Controller [transfers.controller.ts](file:///c:/Users/gabri/Documents/trae_projects/Nexo/src/transfers/transfers.controller.ts)
- PIX Payments: Module [pix.module.ts](file:///c:/Users/gabri/Documents/trae_projects/Nexo/src/payments/pix/pix.module.ts), Controller [pix.controller.ts](file:///c:/Users/gabri/Documents/trae_projects/Nexo/src/payments/pix/pix.controller.ts), Webhook [webhook.controller.ts](file:///c:/Users/gabri/Documents/trae_projects/Nexo/src/payments/pix/webhook.controller.ts), Service [pix.service.ts](file:///c:/Users/gabri/Documents/trae_projects/Nexo/src/payments/pix/pix.service.ts), Providers [openpix.provider.ts](file:///c:/Users/gabri/Documents/trae_projects/Nexo/src/payments/pix/providers/openpix.provider.ts) and [efi.provider.ts](file:///c:/Users/gabri/Documents/trae_projects/Nexo/src/payments/pix/providers/efi.provider.ts)

## Technical Design Highlights
- Validation: Global `ValidationPipe` with `whitelist`, `forbidNonWhitelisted`, and auto-transform to ensure DTO integrity.
- Logging/Error Handling: Interceptors wrap controller responses, emitting concise logs and normalizing DB errors.
- Idempotency Strategy: For `POST` requests with `Idempotency-Key`, responses are cached in Redis with TTL. Replays return the cached payload, avoiding repeated side-effects.
- Transaction Safety: Transfers load both wallets under pessimistic write locks within a `QueryRunner` transaction, mutating balances and committing atomically. Failures trigger rollback.
- Decimal Handling: Balances are stored in Postgres as `numeric(20,2)` and represented as strings to avoid floating-point errors.

## Getting Started
1. Clone and install dependencies:
   - `npm install`
2. Configure environment:
   - Copy `/.env.example` to `/.env` and adjust variables.
3. Run with Docker (recommended):
   - `docker-compose up -d`
4. Start the API (local dev):
   - `npm run start:dev`
5. Open Swagger:
   - `http://localhost:3000/docs`

## Configuration
- Core
  - `PORT` default `3000`
  - `API_KEY` for `x-api-key` guard
- Database (Postgres)
  - `DB_HOST`, `DB_PORT`, `DB_USER`, `DB_PASSWORD`, `DB_NAME`
- Redis
  - `REDIS_HOST`, `REDIS_PORT`
- PIX Providers
  - `PIX_PROVIDER` = `openpix` | `efi`
  - OpenPix: `OPENPIX_API_KEY`
  - Efí: `EFI_CLIENT_ID`, `EFI_CLIENT_SECRET`, `EFI_CERT_PATH`, `EFI_BASE_URL` (sandbox values)
- See [/.env.example](file:///c:/Users/gabri/Documents/trae_projects/Nexo/.env.example)

## API Reference (Summary)
- Health
  - `GET /health` → `{ status: 'ok' }`
- Wallets (requires header `x-api-key`)
  - `POST /wallets` `{ userId }` → create wallet
  - `GET /wallets/:userId` → get wallet
- Transfers (requires `x-api-key`; supports `Idempotency-Key`)
  - `POST /transfers` `{ fromUserId, toUserId, amount }` → atomic transfer
- PIX (requires `x-api-key`; supports `Idempotency-Key`)
  - `POST /pix/charge` `{ amount, recipientUserId, payerName? }` → `{ txid, qrCode }`
  - `POST /pix/webhook` provider callback to apply wallet credit
- Docs
  - `GET /docs` → Swagger UI

### Headers
- `x-api-key: <your-api-key>`
- `Idempotency-Key: <unique-key-per-operation>`

## Idempotency Details
- Applicable to `POST /transfers` and `POST /pix/charge`.
- Redis `SET NX EX` stores the final response under `idem:<key>`.
- Repeated requests with the same `Idempotency-Key` short-circuit and return the cached payload.

## Transaction Safety (Transfers)
- Reads both wallets under `pessimistic_write` lock.
- Checks funds and updates balances inside a single transaction.
- `commit` persists both updates together; errors cause `rollback`.

## PIX Integration
- Provider selection by `PIX_PROVIDER`: `openpix` (default) or `efi`.
- OpenPix uses API key authentication and returns `txid` and QR payload/URL.
- Efí flow typically requires OAuth and mTLS certificates; the included provider demonstrates the request sequence and should be adapted with sandbox credentials.
- Webhook normalizes provider payload and credits the recipient wallet.
- For production, add webhook signature verification and idempotent event handling per provider documentation.

## Testing
- Unit: `npm test`
  - Example: transfers service spec [transfers.service.spec.ts](file:///c:/Users/gabri/Documents/trae_projects/Nexo/test/unit/transfers.service.spec.ts)
- E2E: `npm run test:e2e`
  - Basic health check: [app.e2e-spec.ts](file:///c:/Users/gabri/Documents/trae_projects/Nexo/test/e2e/app.e2e-spec.ts)

## Docker
- Compose services: `api`, `db` (Postgres), `redis`.
- Start all: `docker-compose up -d`
- Rebuild: `docker-compose up --build -d`
- Env variables forwarded to the `api` service; Postgres volume persists data (`pgdata`).

## Security Notes
- Never commit secrets; use `.env` and secret managers.
- Keep `API_KEY` configured in environments exposed to the internet.
- Validate all incoming data via DTOs and consider rate-limiting in front of the API for added protection.

## License
MIT
