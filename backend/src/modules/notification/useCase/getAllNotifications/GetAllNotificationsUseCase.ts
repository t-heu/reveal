import { inject, injectable } from 'tsyringe';

import { io, connectUsers } from '../../../../shared/infra/ws';
import { INotificationRepository } from '../../repos/INotification';
import { GetAllHidesPostDTO, ResponseDTO } from './GetAllNotificationsDTO';
import { IUseCase } from '../../../../shared/domain/UseCase';
import NotiMap from '../../mappers/notiMap';

@injectable()
class GetAllNotificationsUseCase
  implements IUseCase<GetAllHidesPostDTO, ResponseDTO> {
  constructor(
    @inject('NotificationRepository')
    private notificationRepository: INotificationRepository,
  ) {}

  public async execute({
    skip,
    userID,
  }: GetAllHidesPostDTO): Promise<ResponseDTO> {
    const {
      result,
      total,
    } = await this.notificationRepository.getAllNotification({
      skip,
      userID,
    });

    const resultCount = await this.notificationRepository.getCountNotificationNotRead(
      userID,
    );

    if (io.io) {
      // Envia nova/atualiza quantidade de notificações novas no client
      io.io.to(connectUsers[userID]).emit('count_notification_not_read', {
        count_notification_not_read: resultCount,
      });
    }

    return {
      notifications: result.map(p => NotiMap.toDTO(p)),
      count: total,
    };
  }
}

export default GetAllNotificationsUseCase;
