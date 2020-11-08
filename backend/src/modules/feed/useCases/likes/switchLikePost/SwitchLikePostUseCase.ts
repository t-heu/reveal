import { inject, injectable } from 'tsyringe';

import { Like } from '../../../domain/like';
import { PostId } from '../../../domain/postId';
import { UserId } from '../../../../users/domain/userId';
import { UniqueEntityID } from '../../../../../shared/domain/UniqueEntityID';
import { ILikeRepository } from '../../../repos/ILikeRepo';
import { IPostRepository } from '../../../repos/IPostRepo';
import { SwitchLikePostDTO } from './SwitchLikePostDTO';

@injectable()
class SwitchLikePostUseCase {
  constructor(
    @inject('LikeRepository')
    private likeRepository: ILikeRepository,
    @inject('PostRepository')
    private postRepository: IPostRepository,
  ) {}

  public async execute({ idPost, userID }: SwitchLikePostDTO): Promise<void> {
    const post_id = PostId.create(new UniqueEntityID(idPost));
    const user_id = UserId.create(new UniqueEntityID(userID));

    const post = await this.postRepository.getPostById(idPost);

    const owner_post = UserId.create(new UniqueEntityID(post.user_id));

    const like = Like.create({
      userId: user_id,
      postId: post_id,
      owner_post,
    });

    if (await this.likeRepository.exists(like)) {
      await this.likeRepository.removeLike(like);
    } else {
      await this.likeRepository.addLike(like);
    }
  }
}

export default SwitchLikePostUseCase;
