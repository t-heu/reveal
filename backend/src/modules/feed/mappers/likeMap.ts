import { Mapper } from '../../../shared/infra/Mapper';
import { Like } from '../domain/like';

// @ts-ignore
class LikeMap implements Mapper<Like> {
  public async toPersistence(t: Like): Promise<any> {
    return {
      id: t.id.toString(),
      createdAt: t.dateTimePosted,
      post_id: t.postId.id.toValue(),
      user_id: t.userId.id.toValue(),
    };
  }
}

export default new LikeMap();
