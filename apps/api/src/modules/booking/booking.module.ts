import { Module } from '@nestjs/common';
import { BookingController } from './booking.controller';
import { BookingService } from './booking.service';
import { BookingEntity } from './entities/booking.entity';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Queue, RedisConnection } from 'bullmq';
import { BullModule } from '@nestjs/bullmq/dist/bull.module';

@Module({
  imports: [
    TypeOrmModule.forFeature([BookingEntity]),
    BullModule.registerQueue({
      name: 'booking',
    })
  ],
  controllers: [BookingController],
  providers: [BookingService],
})
export class BookingModule {}
