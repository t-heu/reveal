import { Request, Response } from 'express';
import { container } from 'tsyringe';

import { BaseController } from '../../../../shared/infra/BaseController';
import RefreshAccessTokenUseCase from './RefreshAccessTokenUseCase';

export class RefreshAccessTokenController extends BaseController {
  constructor() {
    super();
  }

  public async executeImpl(req: Request, res: Response): Promise<any> {
    const { refresh_token, grant_type } = req.query as {
      refresh_token: string;
      grant_type: string;
    };

    const response = container.resolve(RefreshAccessTokenUseCase);
    const result = await response.execute({
      refresh_token,
      grant_type,
    });

    return this.ok(res, {
      access_token: result.access_token,
      refresh_token: result.refresh_token,
      token_type: result.token_type,
      expires: result.expires,
    });
  }
}
