import { ValueObject } from '../../../shared/domain/ValueObject';
import { AppError } from '../../../shared/core/AppError';

export interface UserEmailProps {
  value: string;
}

export class UserEmail extends ValueObject<UserEmailProps> {
  get value(): string {
    return this.props.value;
  }

  private constructor(props: UserEmailProps) {
    super(props);
  }

  private static isValidEmail(email: string) {
    const re = /^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
    return re.test(email);
  }

  private static format(email: string): string {
    return email.trim().toLowerCase();
  }

  public static create(email: string): UserEmail {
    if (!email) {
      throw new AppError('Email address not empty');
    }

    if (!this.isValidEmail(email)) {
      throw new AppError('Email address not valid');
    }

    return new UserEmail({ value: this.format(email) });
  }
}
