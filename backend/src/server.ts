import 'reflect-metadata';

// Infra
import './shared/infra/database';
import './shared/infra/container';
import './shared/infra/providers/MailProvider';
import './shared/infra/app';

// Subscribers
import './modules/notification/subscribers';
import './modules/users/subscribers';

console.log('[App]: 🚀 Start server');
