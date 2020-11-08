import { Repository, getRepository } from 'typeorm';

import NotificationTypeorm from '../../../../../shared/infra/database/typeorm/entity/Notification';
import {
  INotificationRepository,
  FindAndCountDTO,
  IResponseAndCount,
} from '../../INotification';
import NotiMap from '../../../mappers/notiMap';
import { Notification } from '../../../domain/notification';

class NotificationRepository implements INotificationRepository {
  private ormRepository: Repository<NotificationTypeorm>;

  constructor() {
    this.ormRepository = getRepository(NotificationTypeorm);
  }

  public async createNotification(data: Notification): Promise<void> {
    const response = await NotiMap.toPersistence(data);
    const noti = this.ormRepository.create(response);

    await this.ormRepository.save(noti);
  }

  public async updateNotificationRead(userID: string): Promise<void> {
    await this.ormRepository
      .createQueryBuilder('notification')
      .update()
      .set({ read: true })
      .where('user_id = :userID', { userID })
      .execute();
  }

  public async getCountNotificationNotRead(userID: string): Promise<number> {
    const result = await this.ormRepository
      .createQueryBuilder('notification')
      .where('user_id = :userID AND read = false', { userID })
      .getCount();

    return result;
  }

  public async getAllNotification({
    skip,
    userID,
  }: FindAndCountDTO): Promise<IResponseAndCount> {
    const [result, total] = await this.ormRepository
      .createQueryBuilder('notification')
      .where({ user_id: userID })
      .skip(skip)
      .take(5)
      .orderBy('notification.createdAt', 'DESC')
      .getManyAndCount();

    return {
      result: result.map(p => NotiMap.toDomain(p)),
      total,
    };
  }
}

export default NotificationRepository;
