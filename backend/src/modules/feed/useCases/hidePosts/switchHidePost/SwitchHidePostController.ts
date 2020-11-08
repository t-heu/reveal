import { Request, Response } from 'express';
import { container } from 'tsyringe';

import SwitchHidePostUseCase from './SwitchHidePostUseCase';
import { BaseController } from '../../../../../shared/infra/BaseController';

export class SwitchHidePostController extends BaseController {
  constructor() {
    super();
  }

  async executeImpl(req: Request, res: Response): Promise<any> {
    const idPost = req.params.id;
    const userID = req.user.id;

    const hide = container.resolve(SwitchHidePostUseCase);
    await hide.execute({ idPost, userID });

    return this.created(res);
  }
}
