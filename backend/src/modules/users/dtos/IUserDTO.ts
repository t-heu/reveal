export interface IUserDTO {
  id: string;
  isEmailVerified: boolean;
  email: string;
  name: string;
  profilePicture: string;
  avatar_url: string | null;
  has_google: boolean;
}
