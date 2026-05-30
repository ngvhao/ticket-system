import { Global, Module } from "@nestjs/common";
import { Redis } from "ioredis";

@Global()
@Module({
  providers: [
    {
      provide: 'REDIS_CLIENT',
      useFactory: async () => {
        const client = new Redis(process.env.REDIS_URL);

        client.on('connect', () =>
          console.log('Redis connected'),
        );

        client.on('error', (err) =>
          console.error('Redis error', err),
        );

        return client;
      },
    },
  ],
  exports: ['REDIS_CLIENT'],
})
export class RedisModule {}