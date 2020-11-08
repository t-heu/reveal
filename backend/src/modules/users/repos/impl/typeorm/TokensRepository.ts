import { Repository, getRepository } from 'typeorm';

import { AppError } from '../../../../../shared/core/AppError';
import Token from '../../../../../shared/infra/database/typeorm/entity/Token';
import { ITokensRepository, ICreateDTO, ISave } from '../../ITokensRepo';

class TokensRepository implements ITokensRepository {
  private ormRepository: Repository<Token>;

  constructor() {
    this.ormRepository = getRepository(Token);
  }

  public async create({ user_id, token, type }: ICreateDTO): Promise<void> {
    const response = this.ormRepository.create({
      user_id,
      token,
      type,
      createdAt: new Date(),
      updatedAt: new Date(),
    });

    await this.ormRepository.save(response);
  }

  public async findByToken(token: string): Promise<Token> {
    const userToken = await this.ormRepository.findOne({
      where: { token },
    });

    if (!userToken) {
      throw new AppError('token does not exists');
    }

    return userToken;
  }

  public async save(data: ISave): Promise<void> {
    await this.ormRepository.update(data.id, data);
  }
}

export default TokensRepository;
