import { inject, injectable } from 'tsyringe';
import { isAfter, addDays } from 'date-fns';

import { IUseCase } from '../../../../shared/domain/UseCase';
import { IUserRepository } from '../../repos/IUserRepo';
import { ITokensRepository } from '../../repos/ITokensRepo';
import { RequestDTO, ResponseDTO } from './RefreshAccessTokenDTO';
import { Jwt, JWTToken } from '../../domain/jwt';
import { AppError } from '../../../../shared/core/AppError';

@injectable()
class RefreshAccessTokenUseCase implements IUseCase<RequestDTO, ResponseDTO> {
  constructor(
    @inject('UserRepository')
    private userRepository: IUserRepository,

    @inject('TokensRepository')
    private tokensRepository: ITokensRepository,
  ) {}

  public async execute(data: RequestDTO): Promise<ResponseDTO> {
    if (data.grant_type !== 'refresh_token') {
      throw new AppError('grant_type is not refresh_token');
    }

    const userToken = await this.tokensRepository.findByToken(
      data.refresh_token,
    );

    if (userToken.is_revoked) {
      throw new AppError('Token already used.');
    }

    const tokenCreatedAt = userToken.createdAt;
    const compareDate = addDays(tokenCreatedAt, 7);
    const dateAge = new Date();

    if (isAfter(dateAge, compareDate)) {
      throw new AppError('Token expired.');
    }

    const user = await this.userRepository.findById(userToken.user_id);

    const access_token: JWTToken = Jwt.generateAccessToken({
      userId: user.id.toValue().toString(),
    });

    const addSixDate = addDays(tokenCreatedAt, 6);
    if (isAfter(dateAge, addSixDate)) {
      const refresh_token_age = Jwt.generateRefreshToken();
      user.setAcessToken(access_token, refresh_token_age);
    }

    user.setAcessToken(access_token, data.refresh_token);

    return {
      access_token,
      refresh_token: user.refreshToken,
      token_type: 'bearer',
      expires: 300,
    };
  }
}

export default RefreshAccessTokenUseCase;
