import { INotis } from '../../dtos/INoti';

export interface GetAllHidesPostDTO {
  skip: number;
  userID: string;
}

export interface ResponseDTO {
  notifications: INotis[];
  count: number;
}
