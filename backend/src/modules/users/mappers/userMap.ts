import { Mapper } from '../../../shared/infra/Mapper';
import { User } from '../domain/user';
import { IUserDTO } from '../dtos/IUserDTO';
import { UniqueEntityID } from '../../../shared/domain/UniqueEntityID';
import { UserName } from '../domain/userName';
import { UserPassword } from '../domain/userPassword';
import { UserEmail } from '../domain/userEmail';

class UserMap implements Mapper<User> {
  public toDTO(t: User): IUserDTO {
    return {
      id: t.id.toString(),
      name: t.name.value,
      isEmailVerified: t.isEmailVerified,
      email: t.email.value,
      profilePicture: t.profilePicture,
      has_google: t.has_google,
      avatar_url: t.avatarUrl.value,
    };
  }

  public toDomain(raw: any): User {
    const userNameOrError = UserName.create({ name: raw.name });
    const userPasswordOrError = UserPassword.create({
      value: raw.password,
      hashed: true,
    });
    const userEmailOrError = UserEmail.create(raw.email);

    const userOrError = User.create(
      {
        name: userNameOrError,
        isEmailVerified: raw.enabled,
        password: userPasswordOrError,
        email: userEmailOrError,
        photo: raw.photo,
        has_google:
          raw.external_auths.filter(
            (google: any) => google.providerName === 'Google',
          ).length > 0,
      },
      new UniqueEntityID(raw.id),
    );

    return userOrError;
  }

  public async toPersistence(t: User): Promise<any> {
    let password = '';

    if (!!t.password === true) {
      if (t.password.isAlreadyHashed()) {
        password = t.password.value;
      } else {
        password = await t.password.getHashedValue();
      }
    }

    return {
      photo: t.profilePicture,
      id: t.userId.id.toString(),
      name: t.name.value,
      email: t.email.value,
      createdAt: new Date(),
      password,
      enabled: t.isEmailVerified,
    };
  }
}

export default new UserMap();
