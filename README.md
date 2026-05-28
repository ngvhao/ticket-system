# Ticket System (Monorepo)

Hệ thống quản lý bán vé / booking dưới dạng monorepo gồm 2 ứng dụng chính:

- `apps/api` — NestJS (API server)
- `apps/web` — Next.js (Frontend)

## Tổng quan

API chịu trách nhiệm xử lý nghiệp vụ (events, bookings, queue/BullMQ, gửi notification). Frontend là ứng dụng Next.js kết nối tới API.

## Cấu trúc chính

- apps/
  - api/ — NestJS app (src, tests, Dockerfile)
  - web/ — Next.js app (app/ hoặc pages/, public, Dockerfile)
- package.json — workspace root

## Yêu cầu

- Node 18+
- npm / pnpm / yarn
- PostgreSQL
- Redis

## Cài đặt & Chạy (development)

API:

```bash
cd apps/api
npm install
npm run start:dev
```

Web:

```bash
cd apps/web
npm install
npm run dev
```

Kiểm tra các file entry:

- `apps/api/src/main.ts`
- `apps/api/src/app.module.ts`
- `apps/web/app/page.tsx`

## Biến môi trường (.env)

Tôi đã tạo các file mẫu `.env.example` để bạn copy thành `.env` và điền giá trị:

- `.env.example` (root) — hướng dẫn chung
- `apps/api/.env.example` — dành cho API
- `apps/web/.env.example` — dành cho Web

Lưu ý: Không commit các file `.env` thật vào git.

Biến quan trọng (API):

- `DATABASE_URL` hoặc `DB_HOST`/`DB_PORT`/`DB_USER`/`DB_PASSWORD`/`DB_NAME`
- `REDIS_URL` hoặc `REDIS_HOST`/`REDIS_PORT`
- `JWT_SECRET` (nếu dùng auth)

Biến quan trọng (Web):

- `NEXT_PUBLIC_API_URL` — endpoint API cho client

## Database & Queue

- Cấu hình DB (TypeORM) tại: `apps/api/src/db/data-source.ts` (kiểm tra `synchronize` — chỉ dùng dev nếu true).
- Redis dùng cho BullMQ (queue). Biến kết nối: `REDIS_URL` hoặc `REDIS_HOST`/`REDIS_PORT`.

## Test

API:

```bash
cd apps/api
npm run test
npm run test:e2e
```

## Docker Compose (mẫu)

Mẫu `docker-compose.yml` để chạy Postgres + Redis + API + Web (tuỳ chỉnh trước khi dùng production):

```yaml
version: '3.8'
services:
  postgres:
    image: postgres:15
    restart: unless-stopped
    environment:
      POSTGRES_USER: postgres
      POSTGRES_PASSWORD: postgres
      POSTGRES_DB: ticket
    ports:
      - "5432:5432"
    volumes:
      - pgdata:/var/lib/postgresql/data

  redis:
    image: redis:7
    restart: unless-stopped
    ports:
      - "6379:6379"

  api:
    build: ./apps/api
    environment:
      - DATABASE_URL=postgres://postgres:postgres@postgres:5432/ticket
      - REDIS_URL=redis://redis:6379
    depends_on:
      - postgres
      - redis
    ports:
      - "3001:3001"

  web:
    build: ./apps/web
    environment:
      - NEXT_PUBLIC_API_URL=http://localhost:3001
    ports:
      - "3000:3000"

volumes:
  pgdata:
```

## Changelog / Changes

- 2026-05-28: Thêm README chi tiết tại root và thêm các file mẫu `.env.example` cho root, `apps/api` và `apps/web`.

## Các file đã thêm

- `.env.example` (root)
- `apps/api/.env.example`
- `apps/web/.env.example`

