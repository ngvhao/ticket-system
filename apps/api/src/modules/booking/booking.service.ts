import { Injectable } from '@nestjs/common';
import { BookingEntity } from './entities/booking.entity';
import { Repository } from 'typeorm/repository/Repository';
import { InjectRepository } from '@nestjs/typeorm';
import { CreateBookingDto } from './dtos/create-booking.dto';
import { Queue } from 'bullmq';
import { InjectQueue } from '@nestjs/bullmq';
import Redis from 'ioredis';

@Injectable()
export class BookingService {
  private redis = new Redis({ host: 'localhost', port: 6379 })

  constructor(
    @InjectRepository(BookingEntity)
    private bookingRepository: Repository<BookingEntity>,
    @InjectQueue('booking') 
    private bookingQueue: Queue
  ) {}

  async createBooking(createBookingDto: CreateBookingDto) {
    const { userId, eventId, quantity } = createBookingDto;
    const jobId = `booking:${userId}:${eventId}:${Date.now()}`

    // Fire and forget — trả về jobId ngay
    await this.bookingQueue.add(
      'process-booking',
      { userId, eventId, quantity, jobId },
      {
        jobId,
        attempts: 3,
        backoff: { type: 'exponential', delay: 500 },
        removeOnComplete: false  // giữ lại để track
      }
    )
    return { jobId, status: 'queued' }
  }

  async tryReverseInventory(eventId: number, quantity: number): Promise<boolean> {
    const script = `
    local stock = tonumber(redis.call('GET', KEYS[1]))
    if stock == nil or stock < ${quantity} then
      return 0
    end
    redis.call('DECRBY', KEYS[1], ${quantity})
    return 1
    `
    const result = await this.redis.eval(script, 1, `inventory:${eventId}:stock`, quantity)
    return result === 1
  }

  async getInventory(eventId: number): Promise<number> {
    const stock = await this.redis.get(`inventory:${eventId}:stock`)
    return stock ? parseInt(stock, 10) : 0
  }

  async setInventory(eventId: number, stock: number): Promise<void> {
    await this.redis.set(`inventory:${eventId}:stock`, stock)
  }

  async findAll(): Promise<BookingEntity[]> {
    return this.bookingRepository.find();
  }

  async findOne(id: number): Promise<BookingEntity> {
    return this.bookingRepository.findOne({
      where: { id },
    });
  }
}
