import { ValueObject } from '../../../shared/domain/ValueObject';
import { AppError } from '../../../shared/core/AppError';

interface CommentTextProps {
  value: string;
}

export class CommentText extends ValueObject<CommentTextProps> {
  public static maxLength = 10000;

  public static minLength = 3;

  get value(): string {
    return this.props.value;
  }

  private constructor(props: CommentTextProps) {
    super(props);
  }

  public static create(props: CommentTextProps): CommentText {
    if (!props.value) {
      throw new AppError('Must provide a Comment for the user');
    }

    if (props.value.length >= this.maxLength) {
      throw new AppError(
        `Comment must be greater than ${this.maxLength} chars and less than 100.`,
      );
    }

    if (props.value.length <= this.minLength) {
      throw new AppError(
        `Comment must be greater than ${this.minLength} chars and less than 100.`,
      );
    }

    return new CommentText(props);
  }
}
