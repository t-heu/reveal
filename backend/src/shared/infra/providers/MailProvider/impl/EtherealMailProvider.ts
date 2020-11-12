import nodemailer, { Transporter } from 'nodemailer';
import { inject, injectable } from 'tsyringe';

import mailConfig from '../../../../../config/mail';
import { IMailProvider, SendMailDTO } from '../dtos/IMailProviderDTO';
import { IMailTemplateProvider } from '../../MailTemplateProvider/dtos/IMailTemplateProviderDTO';

@injectable()
export default class EtherealMailProvider implements IMailProvider {
  private client: Transporter;

  constructor(
    @inject('MailTemplateProvider')
    private mailTemplateProvider: IMailTemplateProvider,
  ) {
    nodemailer.createTestAccount().then(account => {
      const transporter = nodemailer.createTransport({
        host: account.smtp.host,
        port: account.smtp.port,
        secure: account.smtp.secure,
        auth: {
          user: account.user,
          pass: account.pass,
        },
      });

      this.client = transporter;
    });
  }

  async sendMail({
    from,
    to,
    subject,
    templateData,
  }: SendMailDTO): Promise<void> {
    const { name, email } = mailConfig.defaults.from;

    const message = await this.client.sendMail({
      from: {
        name: from?.name || name,
        address: from?.email || email,
      },
      to: {
        name: to.name,
        address: to.email,
      },
      subject,
      html: await this.mailTemplateProvider.parse(templateData),
    });

    console.log(nodemailer.getTestMessageUrl(message));
  }
}
