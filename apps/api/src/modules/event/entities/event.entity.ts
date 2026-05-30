import { BookingEntity } from "@/modules/booking/entities/booking.entity";
import { Column, Entity, OneToMany, PrimaryGeneratedColumn } from "typeorm";

@Entity('events')
export class EventEntity {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({name: 'name'})
  name: string;

  @Column({name: 'date'})
  date: Date;

  @Column({name: 'location'})
  location: string;

  @Column({ name: 'inventory', default: 100 })
  inventory: number;

  @OneToMany(() => BookingEntity, (booking) => booking.event)
  bookings: BookingEntity[];
}