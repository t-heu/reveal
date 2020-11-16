import { inject, injectable } from 'tsyringe';

import { IUseCase } from '../../../../shared/domain/UseCase';
import { AppError } from '../../../../shared/core/AppError';
import { IUserRepository } from '../../repos/IUserRepo';
import { CreateUserDTO } from './CreateUserDTO';
import { User } from '../../domain/user';
import { UserName } from '../../domain/userName';
import { UserEmail } from '../../domain/userEmail';
import { UserPhoto } from '../../domain/userPhoto';
import { UserPassword } from '../../domain/userPassword';

@injectable()
class CreateUserUseCase implements IUseCase<CreateUserDTO, void> {
  constructor(
    @inject('UserRepository')
    private userRepository: IUserRepository,
  ) {}

  public async execute(data: CreateUserDTO): Promise<void> {
    const name = UserName.create({ name: data.name });
    const email = UserEmail.create(data.email);
    const password = UserPassword.create({ value: data.password });
    const photo = UserPhoto.create();

    const user = User.create({ name, email, password, photo });

    if (await this.userRepository.exists(email)) {
      throw new AppError(
        `The email ${email.value} associated for this account already exists`,
      );
    }

    await this.userRepository.create(user);
  }
}

export default CreateUserUseCase;
