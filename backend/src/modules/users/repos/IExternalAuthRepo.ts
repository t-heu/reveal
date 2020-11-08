export interface ICreateDTO {
  providerUserId: string;
  providerName: string;
  userId: string;
}

export interface IExternalAuthRepository {
  findLoginSocialOrCreate(data: ICreateDTO): Promise<void>;
}
