import { AuthProviderProfileInfo } from './authProviderProfileInfo';

export abstract class AuthProvider {
  abstract getProfileInfo: (...args: any[]) => Promise<AuthProviderProfileInfo>;

  abstract checkValidAuthToken: (...args: any[]) => Promise<boolean>;
}
