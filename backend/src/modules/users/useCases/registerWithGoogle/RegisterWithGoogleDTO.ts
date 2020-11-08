import { User } from '../../domain/user';

export interface RegisterWithGoogleDTO {
  accessTokenGoogle: string;
  /* email: string;
  photo: string;
  name: string;
  providerUserId: string;
  providerName: string; */
}

export interface ResponseDTO {
  user: User;
  accessToken: string;
}
