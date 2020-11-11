import socket from 'socket.io';
import { Server } from 'http';

import { ClearNotificationController } from '../../../modules/notification/useCase/clearNotification';

interface IWs {
  io?: socket.Server;
}

const connectUsers: any = {};
const io: IWs = {};

export default (server: Server): void => {
  io.io = socket(server);

  io.io.on('connection', socket => {
    const { user } = socket.handshake.query;
    connectUsers[user] = socket.id;
    // console.log('PING PONG');
    socket.on('count_notification_not_read', data => {
      if (data.clear) {
        console.log(data, ' --- ');
        ClearNotificationController.executeImpl({ userID: data.user });
      }
    });
  });
};

export { connectUsers, io };
