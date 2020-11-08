import { Request, Response } from 'express';
import { container } from 'tsyringe';

import ShowAllPostUseCase from './ShowAllPostUseCase';
import { BaseController } from '../../../../../shared/infra/BaseController';
import PostMap from '../../../mappers/postMap';

export class ShowAllPostController extends BaseController {
  constructor() {
    super();
  }

  async executeImpl(req: Request, res: Response): Promise<any> {
    const { page = 1 } = req.query;
    const userID = req.user.id;

    const post = container.resolve(ShowAllPostUseCase);
    const result = await post.execute({
      page: Number(page),
      userID,
    });

    res.header('X-Total-Count', String(result.count));
    return this.ok(
      res,
      result.posts.map(p => PostMap.toDTO(p)),
    );
  }
}
