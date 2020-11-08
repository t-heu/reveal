import { Mapper } from '../../../shared/infra/Mapper';
import { HidePost } from '../domain/hidePost';

// @ts-ignore
class HidePostMap implements Mapper<HidePost> {
  public async toPersistence(t: HidePost): Promise<any> {
    return {
      createdAt: t.dateTimePosted,
      user_id: t.userId.id.toValue(),
      post_id: t.postId.id.toValue(),
    };
  }
}

export default new HidePostMap();
