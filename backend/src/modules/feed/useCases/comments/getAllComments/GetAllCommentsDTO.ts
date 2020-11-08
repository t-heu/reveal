import { Comment } from '../../../domain/comment';

export interface ShowAllCommentsDTO {
  page: number;
  idPost: string;
}

export interface ResponseDTO {
  comments: Comment[];
  count: number;
}
