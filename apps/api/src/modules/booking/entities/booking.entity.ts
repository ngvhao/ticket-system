import { EventEntity } from 'src/modules/event/entities/event.entity';
import { Column, Entity, ManyToOne, PrimaryGeneratedColumn } from 'typeorm';

@Entity()
export class BookingEntity {
  @PrimaryGeneratedColumn()
  id: number;
  @Column()
  eventId: number;
  @Column()
  userId: number;


  @ManyToOne(() => EventEntity, (event) => event.bookings)
  event: EventEntity;
}