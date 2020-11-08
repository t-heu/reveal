import { Request, Response } from 'express';
import { container } from 'tsyringe';

import VerifyEmailUseCase from './VerifyEmailUseCase';
import { BaseController } from '../../../../shared/infra/BaseController';

export class VerifyEmailController extends BaseController {
  constructor() {
    super();
  }

  async executeImpl(req: Request, res: Response): Promise<any> {
    const { token } = req.body;

    const response = container.resolve(VerifyEmailUseCase);
    await response.execute({ token });

    return this.created(res);
  }
}
