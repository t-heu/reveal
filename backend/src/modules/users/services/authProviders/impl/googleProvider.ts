import axios from 'axios';
import { AuthProviderProfileInfo } from '../models/authProviderProfileInfo';
import { AuthProvider } from '../models/authProvider';

export interface IGoogleService extends AuthProvider {
  getProfileInfo: () => Promise<AuthProviderProfileInfo>;
  checkValidAuthToken: (token: string) => Promise<boolean>;
}

export class GoogleService implements IGoogleService {
  private data: any;

  public async getProfileInfo(): Promise<AuthProviderProfileInfo> {
    try {
      const { data } = this;

      return {
        fullName: data.given_name,
        verified_email: data.verified_email,
        profilePictureUrl: data.picture,
        userId: data.id,
        userEmail: data.email,
      };
    } finally {
      this.data = '';
    }
  }

  async checkValidAuthToken(token: string): Promise<boolean> {
    try {
      const response = await axios({
        method: 'GET',
        url: 'https://www.googleapis.com/oauth2/v1/userinfo?alt=json', // `https://www.googleapis.com/plus/v1/people/me?access_token=${token}`,
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      // hasOwnProperty('id')
      if (response.data.id) {
        this.data = response.data;
      }
      return !!response.data.id;
    } catch (err) {
      return false;
    }
  }
}
