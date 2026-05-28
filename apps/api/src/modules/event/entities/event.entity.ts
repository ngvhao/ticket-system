import { BookingEntity } from "src/modules/booking/entities/booking.entity";
import { Column, Entity, OneToMany, PrimaryGeneratedColumn } from "typeorm";

@Entity()
export class EventEntity {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  name: string;

  @Column()
  date: Date;

  @Column()
  location: string;

  @OneToMany(() => BookingEntity, (booking) => booking.event)
  bookings: BookingEntity[];
}