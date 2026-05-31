import { Processor, WorkerHost } from '@nestjs/bullmq';
import { BookingService } from './booking.service';
import { Job } from 'bullmq';
import { NotificationService } from '../notification/notification.service';

@Processor('booking')
export class BookingProcessor extends WorkerHost {
  constructor(
    private readonly bookingService: BookingService,
    private readonly notificationService: NotificationService,
  ) {
    super();
  }

  async process(job: Job) {
    switch (job.name) {
      case 'process-booking':
        return this.handleProcessBooking(job);
      default:
        console.warn(`Unknown job type: ${job.name}`);
        break;
    }
  }

  private async handleProcessBooking(job: Job) {
    const { userId, eventId, quantity, jobId } = job.data;
    console.log(
      `Processing booking job ${jobId} for user ${userId}, event ${eventId}, quantity ${quantity}`,
    );
    const reserved = await this.bookingService.tryReverseInventory(
      eventId,
      quantity,
    );
    if (!reserved) {
      console.log(
        `Booking failed for job ${jobId}: insufficient inventory for event ${eventId}`,
      );
      this.notificationService.sendNotification(
        `Số lượng vé đã hết. Hẹn gặp lại bạn trong những sự kiện tiếp theo!`,
        userId
      );
      return 'failed';
    }

    try {
      const ticket = await this.bookingService.create({
        userId,
        eventId,
        quantity,
      });
      console.log(
        `Booking successful for job ${jobId}: created ticket with ID ${ticket.id}`,
      );
      this.notificationService.sendNotification(
        `Chúc mừng! Đặt vé thành công cho sự kiện ${eventId}, số lượng ${quantity}`,
        userId
      );
      return ticket;
    } catch (err) {
      console.error(`Error processing booking job ${jobId}:`, err);
      await this.bookingService.setInventory(
        eventId,
        (await this.bookingService.getInventory(eventId)) + quantity,
      );
      this.notificationService.sendNotification(
        `Đặt vé thất bại cho sự kiện ${eventId}. Vui lòng thử lại.`,
        userId
      );
      return 'failed';
    }
  }
}
