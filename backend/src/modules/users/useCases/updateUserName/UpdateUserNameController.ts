import { Request, Response } from 'express';
import { container } from 'tsyringe';

import UpdateUserNameUseCase from './UpdateUserNameUseCase';
import { BaseController } from '../../../../shared/infra/BaseController';

export class UserUpdateNameController extends BaseController {
  constructor() {
    super();
  }

  async executeImpl(req: Request, res: Response): Promise<any> {
    const userID = req.user.id;
    const { name } = req.body;

    const user = container.resolve(UpdateUserNameUseCase);
    await user.execute({
      id: userID,
      name,
    });

    return this.created(res);
  }
}
