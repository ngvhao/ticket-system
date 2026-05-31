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
    const { userId, eventId, quantity, jobId } = job.data

    // 1. Idempotency — tránh duplicate khi retry
    const existing = await this.bookingService.findByJobId(jobId)
    if (existing) return existing

    // 2. Atomic inventory check
    const reserved = await this.bookingService.tryReverseInventory(eventId, quantity)
    if (!reserved) {
      // Hết vé — kết quả cuối cùng, không retry
      await this.notificationService.sendNotification(
        `Số lượng vé đã hết. Hẹn gặp lại bạn trong những sự kiện tiếp theo!`,
        userId
      )
      return { status: 'sold_out' }
    }

    try {
      const ticket = await this.bookingService.create({ userId, eventId, quantity, jobId })
      await this.notificationService.sendNotification(
        `Chúc mừng! Đặt vé thành công cho sự kiện ${eventId}`,
        userId
      )
      return ticket

    } catch (err) {
      console.error(`Error processing booking job ${jobId}:`, err);
      await this.bookingService.increaseInventory(eventId, quantity);
      await this.notificationService.sendNotification(
        `Đặt vé thất bại cho sự kiện ${eventId}. Vui lòng thử lại.`,
        userId
      );
      throw err; // retry sẽ được tự động kích hoạt bởi BullMQ
    }
  }
}
