import { Request, Response } from 'express';
import { container } from 'tsyringe';

import { BaseController } from '../../../../shared/infra/BaseController';
import GetAllNotificationsUseCase from './GetAllNotificationsUseCase';
// import PostMap from '../../../mappers/postMap';

export class GetAllNotificationsController extends BaseController {
  constructor() {
    super();
  }

  async executeImpl(req: Request, res: Response): Promise<any> {
    const { page = 0 } = req.query;
    const userID = req.user.id;

    const posts = container.resolve(GetAllNotificationsUseCase);
    const result = await posts.execute({
      skip: Number(page),
      userID,
    });

    res.header('X-Total-Count', String(result.count));
    return this.ok(
      res,
      result, // .posts.map(p => PostMap.toDTO(p)),
    );
  }
}
