import { Request, Response } from 'express';
import { container } from 'tsyringe';

import ShowOnePostUseCase from './ShowOnePostUseCase';
import { BaseController } from '../../../../../shared/infra/BaseController';
import PostMap from '../../../mappers/postMap';

export class ShowOnePostController extends BaseController {
  constructor() {
    super();
  }

  async executeImpl(req: Request, res: Response): Promise<any> {
    const { id } = req.params;
    const userID = req.user.id;

    const post = container.resolve(ShowOnePostUseCase);
    const response = await post.execute({ id, userID });

    return this.ok(res, PostMap.toDTO(response));
  }
}
