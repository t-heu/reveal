import { inject, injectable } from 'tsyringe';
import crypto from 'crypto';

import { IUseCase } from '../../../../shared/domain/UseCase';
// import { AppError } from '../../../../shared/core/AppError';
import { IUserRepository } from '../../repos/IUserRepo';
import { UpdateUserAvatarDTO } from './UpdateUserAvatarDTO';

@injectable()
class UpdateUserAvatarUseCase implements IUseCase<UpdateUserAvatarDTO, string> {
  constructor(
    @inject('UserRepository')
    private userRepository: IUserRepository,
  ) {}

  public async execute({ id }: UpdateUserAvatarDTO): Promise<string> {
    const userInfo = await this.userRepository.findById(id);
    let photo = '';

    if (
      userInfo.profilePicture.match(/(https|http?:\/\/[^\s]+)/g) ||
      userInfo.profilePicture === 'no_photo.jpg'
    ) {
      photo = `${crypto.randomBytes(16).toString('hex')}-${Date.now()}.jpg`;

      await this.userRepository.save({
        id: userInfo.id.toValue() as string,
        data: {
          photo,
        },
      });
    }

    return photo || userInfo.profilePicture;
  }
}

export default UpdateUserAvatarUseCase;
