import { Request, Response } from 'express';
import { container } from 'tsyringe';

import UserMap from '../../mappers/userMap';
import { BaseController } from '../../../../shared/infra/BaseController';
import RegisterWithGoogleUseCase from './RegisterWithGoogleUseCase';

export class RegisterWithGoogleController extends BaseController {
  constructor() {
    super();
  }

  async executeImpl(req: Request, res: Response): Promise<any> {
    const { accessTokenGoogle } = req.body;

    const user = container.resolve(RegisterWithGoogleUseCase);
    const result = await user.execute({
      accessTokenGoogle,
    });

    return this.ok(res, {
      user: UserMap.toDTO(result.user),
      accessToken: result.accessToken,
    });
  }
}
