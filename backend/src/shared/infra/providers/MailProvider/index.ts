import { container } from 'tsyringe';

import mailConfig from '../../../../config/mail';
import { IMailProvider } from './dtos/IMailProviderDTO';
import EtherealMailProvider from './impl/EtherealMailProvider';

const providers = {
  ethereal: container.resolve(EtherealMailProvider),
};

container.registerInstance<IMailProvider>(
  'MailProvider',
  providers[mailConfig.driver],
);
