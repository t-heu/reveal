import { inject, injectable } from 'tsyringe';

import { IPostRepository } from '../../../repos/IPostRepo';
import { UserId } from '../../../../users/domain/userId';
import { UniqueEntityID } from '../../../../../shared/domain/UniqueEntityID';
import { CreatePostDTO } from './CreatePostDTO';
import { IUseCase } from '../../../../../shared/domain/UseCase';
import { Post } from '../../../domain/post';
import { PostText } from '../../../domain/postText';

@injectable()
class CreatePostUseCase implements IUseCase<CreatePostDTO, void> {
  constructor(
    @inject('PostRepository')
    private postRepository: IPostRepository,
  ) {}

  public async execute({ description, userID }: CreatePostDTO): Promise<void> {
    const text = PostText.create({ value: description });
    const user_id = UserId.create(new UniqueEntityID(userID));

    const post = Post.create({ text, userId: user_id });

    await this.postRepository.create(post);
  }
}

export default CreatePostUseCase;
