import { Request, Response } from 'express';
import { container } from 'tsyringe';

import { BaseController } from '../../../../shared/infra/BaseController';
import GetCountNotificationNotReadUseCase from './GetCountNotificationNotReadUseCase';

export class GetCountNotificationNotReadController extends BaseController {
  constructor() {
    super();
  }

  async executeImpl(req: Request, res: Response): Promise<any> {
    const userID = req.user.id;

    const response = container.resolve(GetCountNotificationNotReadUseCase);
    const result = await response.execute({
      userID,
    });

    // res.header('X-Total-Count', String(result.count));
    return this.ok(res, result);
  }
}
