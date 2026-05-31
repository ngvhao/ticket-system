import { Inject, Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { EventEntity } from './entities/event.entity';
import { CreateEventDto } from './dtos/create-event.dto';
import { UpdateEventDto } from './dtos/update-event.dto';
import { BookingService } from '../booking/booking.service';

@Injectable()
export class EventService {
  constructor(
    @InjectRepository(EventEntity)
    private readonly eventRepository: Repository<EventEntity>,
    @Inject()
    private readonly bookingService: BookingService
  ) {}

  async create(createEventDto: CreateEventDto) {
    let eventId: number | null = null;
    try {
        const event = this.eventRepository.create(createEventDto);
        await this.eventRepository.save(event);
        eventId = event.id;
        // Khởi tạo inventory trong Redis
        await this.bookingService.setInventory(event.id, createEventDto.inventory || 100);
        return event;
    } catch (error) {
      console.error('Error creating event:', error);
      // Nếu có lỗi, đảm bảo không để lại inventory trong Redis
      if (eventId) {
        await this.bookingService.setInventory(eventId, 0);
      }
      throw new Error('Failed to create event');
    }
  }

async findAll() {
  const events = await this.eventRepository.find({
    relations: ['bookings'],
  });

  return Promise.all(
    events.map(async event => {
      let remainingInventory =
        await this.bookingService.getInventory(event.id);

      // Redis miss -> rebuild từ DB
      if (!remainingInventory) {
        const bookedQuantity =
          event.bookings?.reduce(
            (sum, booking) => sum + booking.quantity,
            0,
          ) || 0;

        remainingInventory = Math.max(
          0,
          event.inventory - bookedQuantity,
        );

        // đồng bộ lại Redis
        await this.bookingService.setInventory(
          event.id,
          remainingInventory,
        );
      }

      return {
        ...event,
        remainingInventory: Number(remainingInventory),
      };
    }),
  );
}

  async findOne(id: number): Promise<EventEntity & { remainingInventory: number }> {
    const event = await this.eventRepository.findOne({
      where: { id },
      relations: ['bookings'],
    });
    if (!event) {
      throw new NotFoundException(`Event with ID ${id} not found`);
    }
    const getRemainingInventory = await this.bookingService.getInventory(event.id);
    const remaining = Math.min(getRemainingInventory, event.inventory - (event.bookings?.reduce((sum, b) => sum + b.quantity, 0) || 0));
    const remainingInventory = remaining >= 0 ? remaining : 0;
    const res = { ...event, remainingInventory };
    return res;
  }

  async update(id: number, updateEventDto: UpdateEventDto) {
    await this.findOne(id);
    await this.eventRepository.update(id, updateEventDto);
    return this.findOne(id);
  }

  async remove(id: number) {
    const event = await this.findOne(id);
    await this.eventRepository.remove(event);
    return { message: `Event with ID ${id} has been deleted` };
  }
}
