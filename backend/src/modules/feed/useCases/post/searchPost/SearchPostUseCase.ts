import { inject, injectable } from 'tsyringe';

import { IPostRepository } from '../../../repos/IPostRepo';
import { SearchPostDTO, ResponseDTO } from './SearchPostDTO';
import { IUseCase } from '../../../../../shared/domain/UseCase';

@injectable()
class SearchPostUseCase implements IUseCase<SearchPostDTO, ResponseDTO> {
  constructor(
    @inject('PostRepository')
    private postRepository: IPostRepository,
  ) {}

  public async execute({
    description,
    userID,
  }: SearchPostDTO): Promise<ResponseDTO> {
    const { result, total } = await this.postRepository.getAllPostSearch({
      search: description,
      userID,
    });

    return {
      posts: result,
      count: total,
    };
  }
}

export default SearchPostUseCase;
