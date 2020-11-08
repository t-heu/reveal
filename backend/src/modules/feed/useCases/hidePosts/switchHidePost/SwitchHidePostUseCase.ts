import { inject, injectable } from 'tsyringe';

import { HidePost } from '../../../domain/hidePost';
import { PostId } from '../../../domain/postId';
import { UserId } from '../../../../users/domain/userId';
import { UniqueEntityID } from '../../../../../shared/domain/UniqueEntityID';
import { IHidePostRepository } from '../../../repos/IHidePostRepo';
import { SwitchHidePostDTO } from './SwitchHidePostDTO';
import { IUseCase } from '../../../../../shared/domain/UseCase';

@injectable()
class SwitchHidePostUseCase implements IUseCase<SwitchHidePostDTO, void> {
  constructor(
    @inject('HidePostRepository')
    private hidePostRepository: IHidePostRepository,
  ) {}

  public async execute({ idPost, userID }: SwitchHidePostDTO): Promise<void> {
    const post_id = PostId.create(new UniqueEntityID(idPost));
    const user_id = UserId.create(new UniqueEntityID(userID));
    const hidePost = HidePost.create({ userId: user_id, postId: post_id });

    if (await this.hidePostRepository.exists(hidePost)) {
      await this.hidePostRepository.removeBlock(hidePost);
    } else {
      await this.hidePostRepository.addBlock(hidePost);
    }
  }
}

export default SwitchHidePostUseCase;
