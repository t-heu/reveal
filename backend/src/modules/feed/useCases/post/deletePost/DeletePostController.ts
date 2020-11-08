import { Request, Response } from 'express';
import { container } from 'tsyringe';

import { BaseController } from '../../../../../shared/infra/BaseController';
import DeletePostUseCase from './DeletePostUseCase';

export class DeletePostController extends BaseController {
  constructor() {
    super();
  }

  async executeImpl(req: Request, res: Response): Promise<any> {
    const { id } = req.params;

    const post = container.resolve(DeletePostUseCase);
    await post.execute({ idPost: id });

    return this.created(res);
  }
}
