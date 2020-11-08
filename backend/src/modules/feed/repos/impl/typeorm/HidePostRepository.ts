import { Repository, getRepository } from 'typeorm';

import { HidePost } from '../../../domain/hidePost';
import HidePostTypeorm from '../../../../../shared/infra/database/typeorm/entity/HidePost';
import { IHidePostRepository } from '../../IHidePostRepo';
import HidePostMap from '../../../mappers/hidePostMap';

class HidePostRepository implements IHidePostRepository {
  private ormRepository: Repository<HidePostTypeorm>;

  constructor() {
    this.ormRepository = getRepository(HidePostTypeorm);
  }

  public async exists(data: HidePost): Promise<boolean> {
    const like = await this.ormRepository.findOne({
      user_id: data.userId.id.toString(),
      post_id: data.postId.id.toString(),
    });

    return !!like;
  }

  public async removeBlock(data: HidePost): Promise<void> {
    await this.ormRepository.delete({
      user_id: data.userId.id.toString(),
      post_id: data.postId.id.toString(),
    });
  }

  public async addBlock(data: HidePost): Promise<void> {
    const hidePost = await HidePostMap.toPersistence(data);
    const block = this.ormRepository.create(hidePost);

    await this.ormRepository.save(block);
  }
}

export default HidePostRepository;
