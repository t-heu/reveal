import { inject, injectable, delay } from 'tsyringe';
import path from 'path';
import { v4 as uuidv4 } from 'uuid';

import { IUseCase } from '../../../../shared/domain/UseCase';
import { IUserRepository } from '../../repos/IUserRepo';
import { ITokensRepository } from '../../repos/ITokensRepo';
import { IMailProvider } from '../../../../shared/infra/providers/MailProvider/dtos/IMailProviderDTO';
import { UserEmail } from '../../domain/userEmail';
import { firebaseGenerateLink } from '../../services/generateLink';

interface IRequestDTO {
  email: string;
  type: string;
  title: string;
}

@injectable()
class SendEmailVerifyUseCase implements IUseCase<IRequestDTO, void> {
  constructor(
    // @ts-ignore
    @inject(delay(() => 'UserRepository'))
    private userRepository: IUserRepository,
    // @ts-ignore
    @inject(delay(() => 'TokensRepository'))
    private tokensRepository: ITokensRepository,
    // @ts-ignore
    @inject(delay(() => 'MailProvider'))
    private mailProvider: IMailProvider,
  ) {}

  public async execute(data: IRequestDTO): Promise<void> {
    const email = UserEmail.create(data.email);
    const user = await this.userRepository.findUserByEmail(email);

    const verifiedEmailTemplate = path.resolve(
      __dirname,
      '..',
      '..',
      'views',
      'verified_email.hbs',
    );

    const generateToken = uuidv4();

    await this.tokensRepository.create({
      user_id: String(user.id.toValue()),
      token: generateToken,
      type: data.type,
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
      subject: data.title,
      templateData: {
        file: verifiedEmailTemplate,
        variables: {
          name: user.name.value,
          link: await firebaseGenerateLink.generateDynamicLink(
            `${process.env.APP_URL}/api/v1/user/confirm/email?token=${generateToken}`,
          ),
        },
      },
    });
  }
}

export default SendEmailVerifyUseCase;
