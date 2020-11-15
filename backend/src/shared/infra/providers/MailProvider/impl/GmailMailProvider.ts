import nodemailer, { Transporter } from 'nodemailer';
import { inject, injectable } from 'tsyringe';

import mailConfig from '../../../../../config/mail';
import { IMailProvider, SendMailDTO } from '../dtos/IMailProviderDTO';
import { IMailTemplateProvider } from '../../MailTemplateProvider/dtos/IMailTemplateProviderDTO';

@injectable()
export default class GmailMailProvider implements IMailProvider {
  private client: Transporter;

  constructor(
    @inject('MailTemplateProvider')
    private mailTemplateProvider: IMailTemplateProvider,
  ) {
    const transporter = nodemailer.createTransport({
      service: 'gmail',
      auth: {
        user: process.env.GMAIL_MAIL_USER,
        pass: process.env.GMAIL_MAIL_PASS,
      },
    });

    this.client = transporter;
  }

  async sendMail({
    from,
    to,
    subject,
    templateData,
  }: SendMailDTO): Promise<void> {
    const { name, email } = mailConfig.defaults.from;

    await this.client.sendMail({
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
  }
}
