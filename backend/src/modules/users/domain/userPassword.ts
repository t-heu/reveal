import bcrypt from 'bcryptjs';

import { ValueObject } from '../../../shared/domain/ValueObject';
import { AppError } from '../../../shared/core/AppError';

export interface IUserPasswordProps {
  value: string;
  hashed?: boolean;
  provider_social?: boolean;
}

export class UserPassword extends ValueObject<IUserPasswordProps> {
  public static minLength = 6;

  get value(): string {
    return this.props.value;
  }

  private constructor(props: IUserPasswordProps) {
    super(props);
  }

  private static isAppropriateLength(password: string): boolean {
    return password.length >= this.minLength;
  }

  /**
   * @method comparePassword
   * @desc Compares as plain-text and hashed password.
   */

  public async comparePassword(plainTextPassword: string): Promise<boolean> {
    let currentPassword: string;

    if (this.isAlreadyHashed()) {
      currentPassword = this.props.value;
      return this.bcryptCompare(plainTextPassword, currentPassword);
    }

    return false;
  }

  private async bcryptCompare(
    plainText: string,
    hashed: string,
  ): Promise<boolean> {
    return bcrypt.compare(hashed, plainText);
  }

  public isAlreadyHashed(): boolean {
    return this.props.hashed || false;
  }

  private async hashPassword(password: string): Promise<string> {
    return bcrypt.hash(password, 8);
  }

  public async getHashedValue(): Promise<string> {
    if (this.isAlreadyHashed()) {
      return this.props.value;
    }
    return this.hashPassword(this.props.value);
  }

  public static create(props: IUserPasswordProps): UserPassword {
    if (props.provider_social) {
      return new UserPassword({
        value: props.value,
        hashed: !!props.hashed === true,
      });
    }

    if (!props.value) {
      throw new AppError('Must provide a password for the user');
    }

    if (!props.hashed) {
      if (!this.isAppropriateLength(props.value)) {
        throw new AppError('Password doesnt meet criteria [6 chars min].');
      }
    }

    return new UserPassword({
      value: props.value,
      hashed: !!props.hashed === true,
    });
  }
}
