/* eslint-disable no-restricted-syntax, no-continue, no-await-in-loop */

import { Expo, ExpoPushMessage } from 'expo-server-sdk';
import { container } from 'tsyringe';

import { CreateNotification } from '../../useCase/createNotification';

const expo = new Expo();

interface Request {
  title: string;
  body: string;
  data: any;
  link: string;
  type: string;
}

class SendNotificationDevice {
  public async execute({
    title,
    body,
    data,
    link,
    type,
  }: Request): Promise<void> {
    const messages: ExpoPushMessage[] = [];
    const somePushTokens: string[] = [];
    const tickets: any[] = [];
    const receiptIds: string[] = [];

    const response = container.resolve(CreateNotification);
    const token = await response.execute({
      description: body,
      link,
      title,
      type,
    });

    if (token) {
      somePushTokens.push(token);
    }

    for (const pushToken of somePushTokens) {
      if (!Expo.isExpoPushToken(pushToken)) {
        console.error(`Push token ${pushToken} is not a valid Expo push token`);
        continue;
      }

      messages.push({
        to: pushToken,
        sound: 'default',
        title,
        body,
        data,
      });
    }

    const chunks = expo.chunkPushNotifications(messages);

    (async () => {
      for (const chunk of chunks) {
        try {
          const ticketChunk = await expo.sendPushNotificationsAsync(chunk);
          tickets.push(...ticketChunk);
        } catch (error) {
          console.error(error);
        }
      }
    })();

    for (const ticket of tickets) {
      if (ticket.id) {
        receiptIds.push(ticket.id);
      }
    }

    const receiptIdChunks = expo.chunkPushNotificationReceiptIds(receiptIds);

    (async () => {
      for (const chunk of receiptIdChunks) {
        try {
          const receipts = await expo.getPushNotificationReceiptsAsync(chunk);
          console.log(receipts, ' -ok');
        } catch (error) {
          console.error(error, ' - e2');
        }
      }
    })();
  }
}

export { SendNotificationDevice };
