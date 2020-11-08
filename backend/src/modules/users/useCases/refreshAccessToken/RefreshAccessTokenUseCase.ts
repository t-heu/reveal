import { inject, injectable } from 'tsyringe';

import { IUseCase } from '../../../../shared/domain/UseCase';
import { IUserRepository } from '../../repos/IUserRepo';
import { RequestDTO, ResponseDTO } from './RefreshAccessTokenDTO';
import { UserEmail } from '../../domain/userEmail';
import { Jwt, JWTToken, RefreshToken } from '../../domain/jwt';
import { AppError } from '../../../../shared/core/AppError';

@injectable()
class RefreshAccessTokenUseCase implements IUseCase<RequestDTO, ResponseDTO> {
  constructor(
    @inject('UserRepository')
    private userRepository: IUserRepository,
  ) {}

  public async execute(data: RequestDTO): Promise<ResponseDTO> {
    if (data.grant_type !== 'refresh_token') {
      throw new AppError('grant_type is not refresh_token');
    }

    const decode = Jwt.decodeJwt(data.refresh_token);

    const email = UserEmail.create(decode);
    const user = await this.userRepository.findUserByEmail(email);

    const access_token: JWTToken = Jwt.generateAccessToken({
      userId: user.id.toValue().toString(),
    });
    const refresh_token: RefreshToken = Jwt.generateRefreshToken({
      email: user.email.value,
    });

    user.setAcessToken(access_token, refresh_token);

    return {
      access_token,
      refresh_token,
      token_type: 'bearer',
      expires: 300,
    };
  }
}

export default RefreshAccessTokenUseCase;
