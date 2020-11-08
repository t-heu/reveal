import { Request, Response } from 'express';
import { container } from 'tsyringe';

import GetAllCommentsUseCase from './GetAllCommentsUseCase';
import { BaseController } from '../../../../../shared/infra/BaseController';
import CommentMap from '../../../mappers/commentMap';

export class GetAllCommentsController extends BaseController {
  constructor() {
    super();
  }

  async executeImpl(req: Request, res: Response): Promise<any> {
    const { page = 1 } = req.query;
    const idPost = req.params.id;

    const comment = container.resolve(GetAllCommentsUseCase);
    const result = await comment.execute({
      page: Number(page),
      idPost,
    });

    res.header('X-Total-Count', String(result.count));
    return this.ok(
      res,
      result.comments.map(p => CommentMap.toDTO(p)),
    );
  }
}
