import { EventEntity } from '@/modules/event/entities/event.entity';
import { Column, Entity, JoinColumn, ManyToOne, PrimaryGeneratedColumn } from 'typeorm';

@Entity('bookings')
export class BookingEntity {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ name: 'event_id' })
  eventId: number;

  @Column({ name: 'user_id' })
  userId: number;

  @Column({ name: 'quantity' })
  quantity: number;

  @ManyToOne(() => EventEntity, (event) => event.bookings)
  @JoinColumn({ name: 'event_id' })
  event: EventEntity;
}