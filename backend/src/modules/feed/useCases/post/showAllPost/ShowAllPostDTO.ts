import { Post } from '../../../domain/post';

export interface ShowAllPostDTO {
  page: number;
  userID: string;
}

export interface ResponseDTO {
  posts: Post[];
  count: number;
}
