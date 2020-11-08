import { inject, injectable } from 'tsyringe';

import { ICommentRepository } from '../../../repos/ICommentRepo';
// import Comment from '../../../../shared/infra/database/typeorm/entity/Comment';
import { ShowAllCommentsDTO, ResponseDTO } from './GetAllCommentsDTO';
import { IUseCase } from '../../../../../shared/domain/UseCase';

@injectable()
class ShowAllCommentsUseCase
  implements IUseCase<ShowAllCommentsDTO, ResponseDTO> {
  constructor(
    @inject('CommentRepository')
    private commentRepository: ICommentRepository,
  ) {}

  public async execute({
    page,
    idPost,
  }: ShowAllCommentsDTO): Promise<ResponseDTO> {
    const { result, total } = await this.commentRepository.findAllCount(
      page,
      idPost,
    );

    return {
      comments: result,
      count: total,
    };
  }
}

export default ShowAllCommentsUseCase;
