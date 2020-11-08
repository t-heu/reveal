import { Request, Response } from 'express';
import { container } from 'tsyringe';

import UserMap from '../../mappers/userMap';
import { BaseController } from '../../../../shared/infra/BaseController';
import GetCurrentUserUserUseCase from './GetCurrentUserUseCase';

export class GetCurrentUserUserController extends BaseController {
  constructor() {
    super();
  }

  public async executeImpl(req: Request, res: Response): Promise<any> {
    const userID = req.user.id;

    const user = container.resolve(GetCurrentUserUserUseCase);
    const result = await user.execute({ id: userID });

    return this.ok(res, {
      user: UserMap.toDTO(result),
    });
  }
}
