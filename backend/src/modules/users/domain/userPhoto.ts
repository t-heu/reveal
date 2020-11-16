// import crypto from 'crypto';

import { ValueObject } from '../../../shared/domain/ValueObject';
import UploadConfig from '../../../config/upload';

export interface UserPhotoProps {
  value: string;
  getUrl?: string;
}

export class UserPhoto extends ValueObject<UserPhotoProps> {
  get value(): string {
    return this.props.value;
  }

  get getUrl(): string {
    return this.props.getUrl || '';
  }

  private constructor(props: UserPhotoProps) {
    super(props);
  }

  private static isPhotoUrl(photo: string) {
    const re = /(https|http?:\/\/[^\s]+)/g;
    return re.test(photo);
  }

  private static formatUrl(photo?: string): string {
    switch (UploadConfig.driver) {
      case 'disk':
        return `${process.env.APP_URL}/files/${photo}?${Date.now()}`;
      case 'firebase_storage':
        return `https://firebasestorage.googleapis.com/v0/b/inspired-skill-159220.appspot.com/o/${photo}?alt=media&token=9ee34224-59f8-44b8-98af-ddf7dec9e239?${Date.now()}`;
      default:
        return `${process.env.APP_URL}/files/${photo}?${Date.now()}`;
    }
  }

  public static create(photo?: string): UserPhoto {
    if (!photo) {
      const newPhoto = 'no_photo.jpg';
      // `${crypto
      //   .randomBytes(16)
      //   .toString('hex')}-${Date.now()}.jpg`;
      return new UserPhoto({
        value: newPhoto,
        getUrl: newPhoto,
      });
    }

    if (this.isPhotoUrl(photo)) {
      return new UserPhoto({ value: photo });
    }

    return new UserPhoto({
      value: photo,
      getUrl: this.formatUrl(photo),
    });
  }
}
