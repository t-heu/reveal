import AuthenticateUserUseCase from './AuthenticateUserUseCase';
import * as Controller from './AuthenticateUserController';

const AuthenticateUserController = new Controller.AuthenticateUserController();

export { AuthenticateUserUseCase, AuthenticateUserController };
