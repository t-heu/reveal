import { Like } from '../domain/like';
// (userID: string, idPost: string)

export interface ILikeRepository {
  exists(data: Like): Promise<boolean>;
  removeLike(data: Like): Promise<void>;
  addLike(data: Like): Promise<void>;
}
