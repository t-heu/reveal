import { Request, Response } from 'express';
import { container } from 'tsyringe';

import UserMap from '../../mappers/userMap';
import { BaseController } from '../../../../shared/infra/BaseController';
import AuthenticateUserUseCase from './AuthenticateUserUseCase';

export class AuthenticateUserController extends BaseController {
  constructor() {
    super();
  }

  public async executeImpl(req: Request, res: Response): Promise<any> {
    const { email, password, locale, notification_key } = req.body;

    const user = container.resolve(AuthenticateUserUseCase);
    const result = await user.execute({
      email,
      password,
      locale,
      notification_key,
    });

    return this.ok(res, {
      user: UserMap.toDTO(result.user),
      access_token: result.access_token,
      refresh_token: result.refresh_token,
      token_type: result.token_type,
      expires: result.expires,
    });
  }
}
