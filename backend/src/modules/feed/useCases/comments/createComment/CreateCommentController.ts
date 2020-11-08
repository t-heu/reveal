import { Request, Response } from 'express';
import { container } from 'tsyringe';

import CreateCommentUseCase from './CreateCommentUseCase';
import { BaseController } from '../../../../../shared/infra/BaseController';

export class CreateCommentController extends BaseController {
  constructor() {
    super();
  }

  async executeImpl(req: Request, res: Response): Promise<any> {
    const { answer } = req.body;
    const idPost = req.params.id;
    const userID = req.user.id;

    const response = container.resolve(CreateCommentUseCase);
    await response.execute({ answer, userID, idPost });

    return this.created(res);
  }
}
