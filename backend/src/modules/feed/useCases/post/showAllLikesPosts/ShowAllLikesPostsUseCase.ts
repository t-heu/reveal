import { inject, injectable } from 'tsyringe';

import { IPostRepository } from '../../../repos/IPostRepo';
import { ShowAllLikesPostsDTO, ResponseDTO } from './ShowAllLikesPostsDTO';
import { IUseCase } from '../../../../../shared/domain/UseCase';

@injectable()
class ShowAllLikesPostsUseCase
  implements IUseCase<ShowAllLikesPostsDTO, ResponseDTO> {
  constructor(
    @inject('PostRepository')
    private postRepository: IPostRepository,
  ) {}

  public async execute({
    skip,
    userID,
  }: ShowAllLikesPostsDTO): Promise<ResponseDTO> {
    const { result, total } = await this.postRepository.getAllPostLiked({
      skip,
      userID,
    });

    return {
      posts: result,
      count: total,
    };
  }
}

export default ShowAllLikesPostsUseCase;
