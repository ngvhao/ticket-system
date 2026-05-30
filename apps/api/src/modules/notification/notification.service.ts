import { Injectable } from '@nestjs/common';
import { NotificationGateway } from '../external/notification-ws';

@Injectable()
export class NotificationService {
    constructor(
        private readonly notificationGateway: NotificationGateway
    ) {}

    sendNotification(notification: string) {
        console.log(`Sending notification: ${notification}`);
        this.notificationGateway.sendNotification(notification);
    }
}
