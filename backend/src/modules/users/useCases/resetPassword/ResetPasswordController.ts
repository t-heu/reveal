import { Request, Response } from 'express';
import { container } from 'tsyringe';

import ResetPasswordUseCase from './ResetPasswordUseCase';
import { BaseController } from '../../../../shared/infra/BaseController';

export class ResetPasswordController extends BaseController {
  constructor() {
    super();
  }

  async executeImpl(req: Request, res: Response): Promise<any> {
    const { password } = req.body;
    const { token } = req.query;

    const user = container.resolve(ResetPasswordUseCase);
    await user.execute({ password, token: String(token) });

    return this.created(res);
  }
}
