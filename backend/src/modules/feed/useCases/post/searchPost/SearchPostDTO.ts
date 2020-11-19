import { Post } from '../../../domain/post';

export interface SearchPostDTO {
  description: string;
  userID: string;
  page: number;
}

export interface ResponseDTO {
  posts: Post[];
  count: number;
}
