import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { BookingModule } from './modules/booking/booking.module';
import { EventModule } from './modules/event/event.module';
import { NotificationModule } from './modules/notification/notification.module';
import { TypeOrmModule } from '@nestjs/typeorm/dist/typeorm.module';
import { initDataSource } from './db/data-source';
import { BullModule } from '@nestjs/bullmq';

@Module({
  imports: [
    TypeOrmModule.forRoot(initDataSource()),
    BullModule.forRoot({
      connection: {
        url: process.env.REDIS_URL || 'redis://localhost:6379',
      },
    }),
    BookingModule, EventModule, NotificationModule
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
