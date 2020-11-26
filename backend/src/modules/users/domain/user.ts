import { UserName } from './userName';
import { UserEmail } from './userEmail';
import { UserPassword } from './userPassword';
import { UserPhoto } from './userPhoto';
import { UserId } from './userId';
import { JWTToken, RefreshToken } from './jwt';
import { UniqueEntityID } from '../../../shared/domain/UniqueEntityID';
import { AggregateRoot } from '../../../shared/domain/AggregateRoot';
import { UserCreated } from './events/userCreated';

interface UserProps {
  email: UserEmail;
  name: UserName;
  password: UserPassword;
  photo: UserPhoto;
  isEmailVerified?: boolean;
  accessToken?: JWTToken;
  refreshToken?: RefreshToken;
  lastLogin?: Date;
  avatarUrl?: string;
  has_google?: boolean;
}

export class User extends AggregateRoot<UserProps> {
  get userId(): UserId {
    return UserId.create(this._id);
  }

  get id(): UniqueEntityID {
    return this._id;
  }

  get name(): UserName {
    return this.props.name;
  }

  get email(): UserEmail {
    return this.props.email;
  }

  get password(): UserPassword {
    return this.props.password;
  }

  get has_google(): boolean {
    return this.props.has_google || false;
  }

  get isEmailVerified(): boolean {
    return this.props.isEmailVerified || false;
  }

  get accessToken(): string {
    return this.props.accessToken || '';
  }

  get refreshToken(): string {
    return this.props.refreshToken || '';
  }

  get lastLogin(): Date {
    return this.props.lastLogin || new Date();
  }

  get profilePicture(): string {
    return this.props.photo.value;
  }

  get avatarUrl(): string {
    return this.props.photo.getUrl;
  }

  private constructor(props: UserProps, id?: UniqueEntityID) {
    super(props, id);
  }

  public setAcessToken(
    accessToken: JWTToken,
    refreshToken: RefreshToken,
  ): void {
    this.props.accessToken = accessToken;
    this.props.refreshToken = refreshToken;
    this.props.lastLogin = new Date();
  }

  public static create(props: UserProps, id?: UniqueEntityID): User {
    const user = new User({ ...props }, id);
    if (!id) user.addDomainEvent(new UserCreated(user));
    return user;
  }
}
