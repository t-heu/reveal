import { User } from '../../domain/user';
import { RefreshToken, JWTToken } from '../../domain/jwt';

export interface AuthenticateUserDTO {
  email: string;
  password: string;
  locale?: string;
  notification_key?: string;
}

export interface ResponseDTO {
  user: User;
  access_token: JWTToken;
  refresh_token: RefreshToken;
  token_type: string;
  expires: number;
}
