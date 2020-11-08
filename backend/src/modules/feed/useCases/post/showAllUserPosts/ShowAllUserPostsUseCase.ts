import { inject, injectable } from 'tsyringe';

import { IPostRepository } from '../../../repos/IPostRepo';
import { ShowAllUserPostsDTO, ResponseDTO } from './ShowAllUserPostsDTO';
import { IUseCase } from '../../../../../shared/domain/UseCase';

@injectable()
class ShowAllUserPostsUseCase
  implements IUseCase<ShowAllUserPostsDTO, ResponseDTO> {
  constructor(
    @inject('PostRepository')
    private postRepository: IPostRepository,
  ) {}

  public async execute({
    id,
    page,
  }: ShowAllUserPostsDTO): Promise<ResponseDTO> {
    const { result, total } = await this.postRepository.findAllUserPosts({
      userID: id,
      skip: page,
    });

    return {
      posts: result,
      count: total,
    };
  }
}

export default ShowAllUserPostsUseCase;
