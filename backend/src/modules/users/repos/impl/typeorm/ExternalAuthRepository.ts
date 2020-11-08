import { Repository, getRepository } from 'typeorm';

// import { User } from '../../../domain/user';
// import UserMap from '../../../mappers/userMap';
import ExternalAuth from '../../../../../shared/infra/database/typeorm/entity/ExternalAuth';
import { ICreateDTO, IExternalAuthRepository } from '../../IExternalAuthRepo';

class ExternalAuthRepository implements IExternalAuthRepository {
  private ormRepository: Repository<ExternalAuth>;

  constructor() {
    this.ormRepository = getRepository(ExternalAuth);
  }

  public async findLoginSocialOrCreate({
    providerName,
    providerUserId,
    userId,
  }: ICreateDTO): Promise<void> {
    const response = await this.ormRepository.findOne({
      where: { providerName, providerUserId },
    });

    if (!response) {
      const userCreated = this.ormRepository.create({
        providerName,
        providerUserId,
        user_id: userId,
      });

      await this.ormRepository.save(userCreated);
    }
  }
}

export default ExternalAuthRepository;
