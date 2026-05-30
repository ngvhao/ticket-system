import { Module } from '@nestjs/common';
import { NotificationService } from './notification.service';
import { NotificationController } from './notification.controller';
import { NotificationGateway } from '../external/notification-ws';

@Module({
  providers: [NotificationService, NotificationGateway],
  controllers: [NotificationController],
  exports: [NotificationService]
})
export class NotificationModule {}
