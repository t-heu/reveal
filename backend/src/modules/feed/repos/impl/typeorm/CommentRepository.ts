import { Repository, getRepository } from 'typeorm';

import CommentTypeorm from '../../../../../shared/infra/database/typeorm/entity/Comment';
import { Comment } from '../../../domain/comment';
import { ICommentRepository, ResponseFindAllCount } from '../../ICommentRepo';
import CommentMap from '../../../mappers/commentMap';

class CommentRepository implements ICommentRepository {
  private ormRepository: Repository<CommentTypeorm>;

  constructor() {
    this.ormRepository = getRepository(CommentTypeorm);
  }

  public async create(data: Comment): Promise<void> {
    const response = await CommentMap.toPersistence(data);
    const comment = this.ormRepository.create(response);

    await this.ormRepository.save(comment);
  }

  public async findAllCount(
    skip: number,
    idPost: string,
  ): Promise<ResponseFindAllCount> {
    const [result, total] = await this.ormRepository.findAndCount({
      where: { post_id: idPost },
      order: { createdAt: 'DESC' },
      take: 10,
      skip,
      relations: ['user'],
    });

    return {
      result: result.map(p => CommentMap.toDomain(p)),
      total,
    };
  }
}

export default CommentRepository;
