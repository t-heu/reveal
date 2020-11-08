import { inject, injectable } from 'tsyringe';

import { IUseCase } from '../../../../shared/domain/UseCase';
import { AppError } from '../../../../shared/core/AppError';
import { IUserRepository } from '../../repos/IUserRepo';
import { AuthenticateUserDTO, ResponseDTO } from './AuthenticateUserDTO';
// import { User } from '../../domain/user';
import { UserEmail } from '../../domain/userEmail';
import { UserPassword } from '../../domain/userPassword';
import { RefreshToken, Jwt, JWTToken } from '../../domain/jwt';

@injectable()
class AuthenticateUserUseCase
  implements IUseCase<AuthenticateUserDTO, ResponseDTO> {
  constructor(
    @inject('UserRepository')
    private userRepository: IUserRepository,
  ) {}

  public async execute(data: AuthenticateUserDTO): Promise<ResponseDTO> {
    const email = UserEmail.create(data.email);
    const password = UserPassword.create({
      value: data.password,
      hashed: true,
    });

    const user = await this.userRepository.findUserByEmail(email);

    if (!(await password.comparePassword(user.password.value))) {
      throw new AppError('invalid password');
    }

    if (data.notification_key || data.locale) {
      await this.userRepository.save({
        id: user.id.toValue().toString(),
        data: (() => {
          if (data.notification_key) {
            return {
              notification_key: data.notification_key,
            };
          }

          if (data.locale) {
            return {
              locale: data.locale,
            };
          }

          return data;
        })(),
      });
    }

    const refresh_token: RefreshToken = Jwt.generateRefreshToken({
      email: user.email.value,
    });
    const access_token: JWTToken = Jwt.generateAccessToken({
      userId: user.id.toValue().toString(),
    });
    user.setAcessToken(access_token, refresh_token);

    return {
      user,
      access_token,
      refresh_token,
      token_type: 'bearer',
      expires: 300,
    };
  }
}

export default AuthenticateUserUseCase;
