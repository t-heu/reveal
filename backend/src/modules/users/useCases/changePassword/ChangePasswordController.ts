import { Request, Response } from 'express';
import { container } from 'tsyringe';

import ChangePasswordUseCase from './ChangePasswordUseCase';
import { BaseController } from '../../../../shared/infra/BaseController';

export class ChangePasswordController extends BaseController {
  constructor() {
    super();
  }

  async executeImpl(req: Request, res: Response): Promise<any> {
    const userID = req.user.id;
    const { newPassword, oldPassword } = req.body;

    const user = container.resolve(ChangePasswordUseCase);
    await user.execute({
      id: userID,
      newPassword,
      oldPassword,
    });

    return this.created(res);
  }
}
