import { Injectable } from '@nestjs/common';
import { NotificationGateway } from '../external/notification-ws';

@Injectable()
export class NotificationService {
    constructor(
        private readonly notificationGateway: NotificationGateway
    ) {}

    async sendNotification(notification: string, userId: number) {
        console.log(`Sending notification: ${notification} to user: ${userId}`);
        await this.notificationGateway.sendNotification(notification, userId);
    }
}
