import { inject, injectable } from 'tsyringe';

import { io, connectUsers } from '../../../../shared/infra/ws';
import { INotificationRepository } from '../../repos/INotification';
import { RequestDTO } from './ClearNotificationDTO';
import { IUseCase } from '../../../../shared/domain/UseCase';

@injectable()
class GetCountNotificationNotReadUseCase implements IUseCase<RequestDTO, void> {
  constructor(
    @inject('NotificationRepository')
    private notificationRepository: INotificationRepository,
  ) {}

  public async execute({ userID }: RequestDTO): Promise<void> {
    await this.notificationRepository.updateNotificationRead(userID);

    const result = await this.notificationRepository.getCountNotificationNotRead(
      userID,
    );

    if (io.io) {
      // Envia nova/atualiza quantidade de notificações novas no client
      io.io.to(connectUsers[userID]).emit('count_notification_not_read', {
        count_notification_not_read: result,
      });
    }
  }
}

export default GetCountNotificationNotReadUseCase;
