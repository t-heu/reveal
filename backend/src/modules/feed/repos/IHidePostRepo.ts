import { HidePost } from '../domain/hidePost';
// (userID: string, idPost: string)

export interface IHidePostRepository {
  exists(data: HidePost): Promise<boolean>;
  removeBlock(data: HidePost): Promise<void>;
  addBlock(data: HidePost): Promise<void>;
}
