import { ValueObject } from '../../../shared/domain/ValueObject';
import { AppError } from '../../../shared/core/AppError';

interface PostTextProps {
  value: string;
}

export class PostText extends ValueObject<PostTextProps> {
  public static maxLength = 10000;

  public static minLength = 2;

  get value(): string {
    return this.props.value;
  }

  private constructor(props: PostTextProps) {
    super(props);
  }

  public static create(props: PostTextProps): PostText {
    if (!props.value) {
      throw new AppError('Must provide a Description for the post');
    }

    if (props.value.length >= this.maxLength) {
      throw new AppError(
        'Description must be greater than 2 chars and less than 100.',
      );
    }

    if (props.value.length <= this.minLength) {
      throw new AppError(
        'Description must be greater than 2 chars and less than 100.',
      );
    }

    return new PostText(props);
  }
}
