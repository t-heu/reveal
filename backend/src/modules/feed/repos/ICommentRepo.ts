import { Comment } from '../domain/comment';

export interface ResponseFindAllCount {
  result: Comment[];
  total: number;
}

// DAO
export interface ICommentRepository {
  create(data: Comment): Promise<void>;
  findAllCount(skip: number, idPost: string): Promise<ResponseFindAllCount>;
}
