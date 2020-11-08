import { Post } from '../../../domain/post';

export interface GetAllHidesPostDTO {
  skip: number;
  userID: string;
}

export interface ResponseDTO {
  posts: Post[];
  count: number;
}
