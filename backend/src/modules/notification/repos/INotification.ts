import { Notification } from '../domain/notification';

export interface ICreateDTO {
  type: string;
  title: string;
  description: string;
  link: string;
  user_id: string;
}

export interface IResponseAndCount {
  result: Notification[];
  total: number;
}

export interface FindAndCountDTO {
  userID: string;
  skip: number;
}

export interface INotificationRepository {
  createNotification(data: Notification): Promise<void>;
  getAllNotification({
    userID,
    skip,
  }: FindAndCountDTO): Promise<IResponseAndCount>;
  getCountNotificationNotRead(userID: string): Promise<number>;
  updateNotificationRead(userID: string): Promise<void>;
}
