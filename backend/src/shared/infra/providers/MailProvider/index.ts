import { container } from 'tsyringe';

import EtherealMailProvider from './impl/EtherealMailProvider';
import mailConfig from '../../../../config/mail';
import { IMailProvider } from './dtos/IMailProviderDTO';

const providers = {
  ethereal: container.resolve(EtherealMailProvider),
};

container.registerInstance<IMailProvider>(
  'MailProvider',
  providers[mailConfig.driver],
);
