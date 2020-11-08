import { inject, injectable } from 'tsyringe';

import { IUseCase } from '../../../../shared/domain/UseCase';
import { AppError } from '../../../../shared/core/AppError';
import { IUserRepository } from '../../repos/IUserRepo';
// import JwtEncrypt from '../../infra/utils/jwtEcrypt';
import { GetCurrentUserDTO } from './GetCurrentUserDTO';
import { User } from '../../domain/user';
// import { UserId } from '../../domain/userId';

@injectable()
class GetCurrentUserUseCase implements IUseCase<GetCurrentUserDTO, User> {
  constructor(
    @inject('UserRepository')
    private userRepository: IUserRepository,
  ) {}

  public async execute(data: GetCurrentUserDTO): Promise<User> {
    if (!data.id) {
      throw new AppError('Token not found', 404);
    }

    const user = await this.userRepository.findById(data.id);

    return user;
  }
}

export default GetCurrentUserUseCase;
