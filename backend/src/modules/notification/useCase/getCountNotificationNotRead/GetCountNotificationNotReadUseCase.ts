import { inject, injectable } from 'tsyringe';

import { INotificationRepository } from '../../repos/INotification';
import { RequestDTO, ResponseDTO } from './GetCountNotificationNotReadDTO';
import { IUseCase } from '../../../../shared/domain/UseCase';

@injectable()
class GetCountNotificationNotReadUseCase
  implements IUseCase<RequestDTO, ResponseDTO> {
  constructor(
    @inject('NotificationRepository')
    private notificationRepository: INotificationRepository,
  ) {}

  public async execute({ userID }: RequestDTO): Promise<ResponseDTO> {
    const result = await this.notificationRepository.getCountNotificationNotRead(
      userID,
    );

    return {
      count_notification_not_read: result,
    };
  }
}

export default GetCountNotificationNotReadUseCase;
