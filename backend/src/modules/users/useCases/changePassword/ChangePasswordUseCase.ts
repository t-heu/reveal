import { inject, injectable } from 'tsyringe';

import { IUseCase } from '../../../../shared/domain/UseCase';
import { AppError } from '../../../../shared/core/AppError';
import { IUserRepository } from '../../repos/IUserRepo';
import { ChangePasswordDTO } from './ChangePasswordDTO';
import { UserPassword } from '../../domain/userPassword';
// import { UserId } from '../../domain/userId';

@injectable()
class ChangePasswordUseCase implements IUseCase<ChangePasswordDTO, void> {
  constructor(
    @inject('UserRepository')
    private userRepository: IUserRepository,
  ) {}

  public async execute(data: ChangePasswordDTO): Promise<void> {
    const existUser = await this.userRepository.findById(data.id);

    if (data.newPassword && !data.oldPassword) {
      throw new AppError(
        'You need to inform the old password to set a new password.',
      );
    }

    if (data.newPassword && data.oldPassword) {
      const currentPassword = UserPassword.create({
        value: data.newPassword,
        hashed: true,
      });
      const oldPassword = UserPassword.create({
        value: data.oldPassword,
        hashed: true,
      });

      if (!(await oldPassword.comparePassword(existUser.password.value))) {
        throw new AppError('Old password does not match.');
      }

      if (await currentPassword.comparePassword(existUser.password.value)) {
        throw new AppError('Equal passwords.');
      }

      await this.userRepository.save({
        id: data.id,
        data: {
          password: await currentPassword.getHashedValue(),
        },
      });
    }
  }
}

export default ChangePasswordUseCase;
