import { ValueObject } from '../../../shared/domain/ValueObject';
import UploadConfig from '../../../config/upload';

export interface UserPhotoProps {
  value: string;
}

export class UserPhoto extends ValueObject<UserPhotoProps> {
  get value(): string {
    return this.props.value;
  }

  private constructor(props: UserPhotoProps) {
    super(props);
  }

  private static isPhotoUrl(photo: string) {
    const re = /(https|http?:\/\/[^\s]+)/g;
    return re.test(photo);
  }

  public static isPhotoValid(photo?: string): string {
    return photo || 'no_photo.jpg';
  }

  private static formatUrl(photo?: string): string {
    switch (UploadConfig.driver) {
      case 'disk':
        return `${process.env.APP_URL}/files/${this.isPhotoValid(
          photo,
        )}?${Date.now()}`;
      case 'firebase_storage':
        return `https://firebasestorage.googleapis.com/v0/b/inspired-skill-159220.appspot.com/o/${this.isPhotoValid(
          photo,
        )}?alt=media&token=9ee34224-59f8-44b8-98af-ddf7dec9e239`;
      default:
        return `${process.env.APP_URL}/files/${this.isPhotoValid(
          photo,
        )}?${Date.now()}`;
    }
  }

  public static create(photo?: string): UserPhoto {
    if (!photo) {
      return new UserPhoto({
        value: `${process.env.APP_URL}/files/no_photo.jpg`,
      });
    }

    if (this.isPhotoUrl(photo)) {
      return new UserPhoto({ value: photo });
    }

    return new UserPhoto({ value: this.formatUrl(photo) });
  }
}
