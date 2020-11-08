import { Repository, getRepository } from 'typeorm';

import { AppError } from '../../../../../shared/core/AppError';
import { User } from '../../../domain/user';
import { UserEmail } from '../../../domain/userEmail';
import UserMap from '../../../mappers/userMap';
import UserTypeorm from '../../../../../shared/infra/database/typeorm/entity/User';

import { IUserRepository, IEditDTO } from '../../IUserRepo';

class UserRepository implements IUserRepository {
  private ormRepository: Repository<UserTypeorm>;

  constructor() {
    this.ormRepository = getRepository(UserTypeorm);
  }

  public async findById(id: string): Promise<User> {
    const response = await this.ormRepository.findOne({
      where: { id },
      relations: ['external_auths', 'tokens'],
    });

    if (!response) throw new AppError('User not found');

    return UserMap.toDomain(response);
  }

  public async findUserByEmail(userEmail: UserEmail): Promise<User> {
    const response = await this.ormRepository.findOne({
      where: { email: userEmail.value },
      relations: ['external_auths', 'tokens'],
    });

    if (!response) throw new AppError('User not found');

    return UserMap.toDomain(response);
  }

  public async exists(userEmail: UserEmail): Promise<boolean> {
    const response = await this.ormRepository.findOne({
      where: { email: userEmail.value },
    });

    return !!response;
  }

  public async create(data: User): Promise<void> {
    const response = await UserMap.toPersistence(data);
    const user = this.ormRepository.create(response);
    await this.ormRepository.save(user);
  }

  public async save(data: IEditDTO): Promise<void> {
    await this.ormRepository.update(data.id, data.data);
  }
}

export default UserRepository;
