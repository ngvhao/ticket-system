import {
  MessageBody,
  SubscribeMessage,
  WebSocketGateway,
  WebSocketServer,
  WsResponse,
} from '@nestjs/websockets';
import { from, Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import { Server, Socket } from 'socket.io';

@WebSocketGateway({
  cors: {
    origin: '*',
  },
})
export class NotificationGateway {
  @WebSocketServer()
  server: Server;

  @SubscribeMessage('events')
  findAll(@MessageBody() data: any): Observable<WsResponse<number>> {
    return from([1, 2, 3]).pipe(map(item => ({ event: 'events', data: item })));
  }

  @SubscribeMessage('identity')
  async identity(@MessageBody() data: number): Promise<number> {
    return data;
  }

  sendNotification(notification: string, userId: number) {
    console.log(`Emitting notification: ${notification} to user: ${userId}`);
    this.server.to(`user:${userId}`).emit('notification', notification);
  }

  handleConnection(client: Socket) {
    const clientUserId = client.handshake.auth.userId;
    client.join(`user:${clientUserId}`); 
    console.log('connected', clientUserId);
    console.log(client.rooms);
     this.server.to(`user:${clientUserId}`).emit('notification', `Chào mừng User ${clientUserId} đã kết nối!`);
  }

  handleDisconnect(client: Socket) {
    console.log('disconnected', client.id);
  }
}