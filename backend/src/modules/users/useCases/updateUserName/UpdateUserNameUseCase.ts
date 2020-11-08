import { inject, injectable } from 'tsyringe';

import { IUseCase } from '../../../../shared/domain/UseCase';
// import { AppError } from '../../../../shared/core/AppError';
import { IUserRepository } from '../../repos/IUserRepo';
import { UpdateUserNameDTO } from './UpdateUserNameDTO';
import { UserName } from '../../domain/userName';
// import { UserId } from '../../domain/userId';

@injectable()
class UpdateUserNameUseCase implements IUseCase<UpdateUserNameDTO, void> {
  constructor(
    @inject('UserRepository')
    private userRepository: IUserRepository,
  ) {}

  public async execute(data: UpdateUserNameDTO): Promise<void> {
    const existUser = await this.userRepository.findById(data.id);

    if (data.name && existUser.name.value !== data.name) {
      const name = UserName.create({ name: data.name });
      await this.userRepository.save({
        id: data.id,
        data: {
          name: name.value,
        },
      });
    }
  }
}

export default UpdateUserNameUseCase;
