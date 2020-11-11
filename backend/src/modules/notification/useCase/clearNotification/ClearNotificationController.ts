import { container } from 'tsyringe';

import ClearNotificationUseCase from './ClearNotificationUseCase';

interface IRequestDTO {
  userID: string;
}

export class ClearNotificationController {
  async executeImpl({ userID }: IRequestDTO): Promise<any> {
    const response = container.resolve(ClearNotificationUseCase);
    await response.execute({
      userID,
    });
  }
}
