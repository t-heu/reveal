import { inject, injectable } from 'tsyringe';

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

    return {
      notifications: result.map(p => NotiMap.toDTO(p)),
      count: total,
    };
  }
}

export default GetAllNotificationsUseCase;
