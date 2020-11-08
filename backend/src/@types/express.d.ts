declare namespace Express {
  export interface Request {
    io: any;
    user: {
      id: string;
    };
  }
}
