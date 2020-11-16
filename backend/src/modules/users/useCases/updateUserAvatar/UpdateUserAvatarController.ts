import { Request, Response } from 'express';
import { container } from 'tsyringe';

import UpdateUserAvatarUseCase from './UpdateUserAvatarUseCase';
import { BaseController } from '../../../../shared/infra/BaseController';

export class UpdateUserAvatarController extends BaseController {
  constructor() {
    super();
  }

  async executeImpl(req: Request, res: Response): Promise<any> {
    try {
      const userID = req.user.id;

      const user = container.resolve(UpdateUserAvatarUseCase);
      await user.execute({
        id: userID,
        photo: req.file.filename,
      });

      return this.created(res);
    } catch (err) {
      console.log(err);
      return this.fail(res, err);
    }
  }
}
