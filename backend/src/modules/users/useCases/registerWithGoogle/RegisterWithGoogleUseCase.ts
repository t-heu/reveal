import { inject, injectable } from 'tsyringe';

import { IUseCase } from '../../../../shared/domain/UseCase';
import { AppError } from '../../../../shared/core/AppError';
import { IUserRepository } from '../../repos/IUserRepo';
import { IExternalAuthRepository } from '../../repos/IExternalAuthRepo';
import { RegisterWithGoogleDTO, ResponseDTO } from './RegisterWithGoogleDTO';
import { User } from '../../domain/user';
import { UserEmail } from '../../domain/userEmail';
import { UserName } from '../../domain/userName';
import { UserPassword } from '../../domain/userPassword';
import { googleService } from '../../services/authProviders';
import { RefreshToken, Jwt, JWTToken } from '../../domain/jwt';

@injectable()
class RegisterWithGoogleUseCase
  implements IUseCase<RegisterWithGoogleDTO, ResponseDTO> {
  constructor(
    @inject('ExternalAuthRepository')
    private externalAuthRepository: IExternalAuthRepository,

    @inject('UserRepository')
    private userRepository: IUserRepository,
  ) {}

  public async execute(data: RegisterWithGoogleDTO): Promise<ResponseDTO> {
    const user: ResponseDTO = {} as ResponseDTO;
    // faz verificação do Auth token

    if (!(await googleService.checkValidAuthToken(data.accessTokenGoogle))) {
      throw new AppError('Google token invalid');
    }

    const googleProfileInfo = await googleService.getProfileInfo();

    const userEmail = UserEmail.create(googleProfileInfo.userEmail);
    const alreadyCreatedUser = await this.userRepository.exists(userEmail);

    if (!alreadyCreatedUser) {
      // se não exitir nenhuma conta Social ou Local ele cria uma com Social
      const name = UserName.create({ name: googleProfileInfo.fullName });
      const password = UserPassword.create({
        value: '',
        provider_social: true,
      });

      const userResponse = User.create({
        name,
        isEmailVerified: googleProfileInfo.verified_email,
        email: userEmail,
        photo: googleProfileInfo.profilePictureUrl,
        password,
      });

      await this.userRepository.create(userResponse);
      user.user = userResponse;

      await this.externalAuthRepository.findLoginSocialOrCreate({
        providerUserId: String(googleProfileInfo.userId),
        providerName: 'Google',
        userId: userResponse.id.toValue() as string,
      });

      const refreshToken: RefreshToken = Jwt.generateRefreshToken({
        email: userResponse.email.value,
      });
      const accessToken: JWTToken = Jwt.generateAccessToken({
        userId: userResponse.id.toValue().toString(),
      });
      userResponse.setAcessToken(accessToken, refreshToken);
    } else {
      const alreadyUser = await this.userRepository.findUserByEmail(userEmail);
      user.user = alreadyUser;

      // procura o social
      // caso não exista o login social desejado, ele cria
      await this.externalAuthRepository.findLoginSocialOrCreate({
        providerUserId: String(googleProfileInfo.userId),
        providerName: 'Google',
        userId: String(alreadyUser.id.toValue()),
      });

      const refreshToken: RefreshToken = Jwt.generateRefreshToken({
        email: alreadyUser.email.value,
      });
      const accessToken: JWTToken = Jwt.generateAccessToken({
        userId: alreadyUser.id.toValue().toString(),
      });
      alreadyUser.setAcessToken(accessToken, refreshToken);
    }

    return {
      user: user.user,
      accessToken: user.accessToken,
    };
  }
}

export default RegisterWithGoogleUseCase;
