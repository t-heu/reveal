export class AppError {
  public readonly message: string;

  public readonly statusCode: number;

  constructor(message = 'Internal server error', statusCode = 400) {
    this.message = message;
    this.statusCode = statusCode;
  }
}
