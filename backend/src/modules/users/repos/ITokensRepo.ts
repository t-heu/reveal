export interface IUserTokenDTO {
  id: string;
  token: string;
  type: string;
  createdAt: Date;
  updatedAt: Date;
  user_id: string;
  is_revoked: number;
}

export interface ISave {
  is_revoked: number;
  id: string;
}

export interface ICreateDTO {
  token: string;
  type: string;
  createdAt?: Date;
  user_id: string;
}

export interface ITokensRepository {
  findByToken(token: string): Promise<IUserTokenDTO>;
  create(data: ICreateDTO): Promise<void>;
  save(data: ISave): Promise<void>;
}
