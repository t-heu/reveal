import { container } from 'tsyringe';

import mailConfig from '../../../../config/mail';
import { IMailProvider } from './dtos/IMailProviderDTO';
import EtherealMailProvider from './impl/EtherealMailProvider';
import GmailMailProvider from './impl/GmailMailProvider';

const providers = {
  ethereal: container.resolve(EtherealMailProvider),
  gmail: container.resolve(GmailMailProvider),
};

container.registerInstance<IMailProvider>(
  'MailProvider',
  providers[mailConfig.driver],
);
