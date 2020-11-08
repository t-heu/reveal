import { Post } from '../../../domain/post';

export interface ShowAllLikesPostsDTO {
  skip: number;
  userID: string;
}

export interface ResponseDTO {
  posts: Post[];
  count: number;
}
