import { Repository, getRepository } from 'typeorm';

import { Like } from '../../../domain/like';
import LikeMap from '../../../mappers/likeMap';
import LikeTypeorm from '../../../../../shared/infra/database/typeorm/entity/Like';
import { ILikeRepository } from '../../ILikeRepo';

class LikeRepository implements ILikeRepository {
  private ormRepository: Repository<LikeTypeorm>;

  constructor() {
    this.ormRepository = getRepository(LikeTypeorm);
  }

  public async exists(data: Like): Promise<boolean> {
    const like = await this.ormRepository.findOne({
      user_id: data.userId.id.toString(),
      post_id: data.postId.id.toString(),
    });

    return !!like;
  }

  public async removeLike(data: Like): Promise<void> {
    await this.ormRepository.delete({
      user_id: data.userId.id.toString(),
      post_id: data.postId.id.toString(),
    });
  }

  public async addLike(data: Like): Promise<void> {
    const liked = await LikeMap.toPersistence(data);
    const like = this.ormRepository.create(liked);
    await this.ormRepository.save(like);
  }
}

export default LikeRepository;
