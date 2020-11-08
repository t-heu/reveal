import { inject, injectable } from 'tsyringe';

import { IPostRepository } from '../../../repos/IPostRepo';
import { Post } from '../../../domain/post';
import { ShowOnePostDTO } from './ShowOnePostDTO';
import { IUseCase } from '../../../../../shared/domain/UseCase';

@injectable()
class ShowOnePostUseCase implements IUseCase<ShowOnePostDTO, Post> {
  constructor(
    @inject('PostRepository')
    private postRepository: IPostRepository,
  ) {}

  public async execute({ id, userID }: ShowOnePostDTO): Promise<Post> {
    const response = await this.postRepository.getPostById(id, userID);
    return response;
  }
}

export default ShowOnePostUseCase;
