import { Request, Response } from 'express';
import { container } from 'tsyringe';

import SwitchLikePostUseCase from './SwitchLikePostUseCase';
import { BaseController } from '../../../../../shared/infra/BaseController';

export class SwitchLikePostController extends BaseController {
  constructor() {
    super();
  }

  async executeImpl(req: Request, res: Response): Promise<any> {
    const idPost = req.params.id;
    const userID = req.user.id;

    const like = container.resolve(SwitchLikePostUseCase);
    await like.execute({ idPost, userID });

    return this.created(res);
  }
}
