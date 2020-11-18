import { inject, injectable } from 'tsyringe';
import path from 'path';
import { v4 as uuidv4 } from 'uuid';

import { IUseCase } from '../../../../shared/domain/UseCase';
// import * as AppError from '../../../../shared/core/AppError';
import { IUserRepository } from '../../repos/IUserRepo';
import { ITokensRepository } from '../../repos/ITokensRepo';
import { IMailProvider } from '../../../../shared/infra/providers/MailProvider/dtos/IMailProviderDTO';
import { SendForgotPasswordEmailDTO } from './SendForgotPasswordEmailDTO';
import { UserEmail } from '../../domain/userEmail';
import { firebaseGenerateLink } from '../../services/generateLink';

@injectable()
class SendForgotPasswordEmailUseCase
  implements IUseCase<SendForgotPasswordEmailDTO, void> {
  constructor(
    @inject('UserRepository')
    private userRepository: IUserRepository,

    @inject('TokensRepository')
    private tokensRepository: ITokensRepository,

    @inject('MailProvider')
    private mailProvider: IMailProvider,
  ) {}

  public async execute(data: SendForgotPasswordEmailDTO): Promise<void> {
    const email = UserEmail.create(data.email);
    const user = await this.userRepository.findUserByEmail(email);

    const forgotPasswordTemplate = path.resolve(
      __dirname,
      '..',
      '..',
      'views',
      'forgot_password.hbs',
    );

    const generateToken = uuidv4();

    await this.tokensRepository.create({
      user_id: String(user.id.toValue()),
      token: generateToken,
      type: 'forgot_password',
    });

    await this.mailProvider.sendMail({
      from: {
        name: 'Reveal',
        email: 'contact@reveal.com',
      },
      to: {
        name: user.name.value,
        email: user.email.value,
      },
      subject: 'Reveal Forgot Password',
      templateData: {
        file: forgotPasswordTemplate,
        variables: {
          name: user.name.value,
          link: await firebaseGenerateLink.generateDynamicLink(
            `${process.env.APP_URL}/api/v1/user/password/reset?token=${generateToken}`,
          ),
        },
      },
    });
  }
}

export default SendForgotPasswordEmailUseCase;
