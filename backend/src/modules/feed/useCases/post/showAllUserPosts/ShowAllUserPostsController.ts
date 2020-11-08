import { Request, Response } from 'express';
import { container } from 'tsyringe';

import ShowAllUserPostsUseCase from './ShowAllUserPostsUseCase';
import { BaseController } from '../../../../../shared/infra/BaseController';
import PostMap from '../../../mappers/postMap';

export class ShowAllUserPostsController extends BaseController {
  constructor() {
    super();
  }

  async executeImpl(req: Request, res: Response): Promise<any> {
    const { page = 0 } = req.query;
    const userID = req.user.id;

    const post = container.resolve(ShowAllUserPostsUseCase);
    const result = await post.execute({
      id: userID,
      page: Number(page),
    });

    res.header('X-Total-Count', String(result.count));
    return this.ok(
      res,
      result.posts.map(p => PostMap.toDTO(p)),
    );
  }
}
