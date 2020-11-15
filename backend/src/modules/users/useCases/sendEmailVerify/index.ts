import { container } from 'tsyringe';
import SendEmailVerifyUseCase from './SendEmailVerifyUseCase';

const sendEmailVerifyUseCase = container.resolve(SendEmailVerifyUseCase);

export { sendEmailVerifyUseCase, SendEmailVerifyUseCase };
