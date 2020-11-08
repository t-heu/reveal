import { container } from 'tsyringe';

import LikeRepository from '../../modules/feed/repos/impl/typeorm/LikeRepository';
import { ILikeRepository } from '../../modules/feed/repos/ILikeRepo';

import CommentRepository from '../../modules/feed/repos/impl/typeorm/CommentRepository';
import { ICommentRepository } from '../../modules/feed/repos/ICommentRepo';

import PostRepository from '../../modules/feed/repos/impl/typeorm/PostRepository';
import { IPostRepository } from '../../modules/feed/repos/IPostRepo';

import HidePostRepository from '../../modules/feed/repos/impl/typeorm/HidePostRepository';
import { IHidePostRepository } from '../../modules/feed/repos/IHidePostRepo';

import UserRepository from '../../modules/users/repos/impl/typeorm/UserRepository';
import { IUserRepository } from '../../modules/users/repos/IUserRepo';

import TokensRepository from '../../modules/users/repos/impl/typeorm/TokensRepository';
import { ITokensRepository } from '../../modules/users/repos/ITokensRepo';

import ExternalAuthRepository from '../../modules/users/repos/impl/typeorm/ExternalAuthRepository';
import { IExternalAuthRepository } from '../../modules/users/repos/IExternalAuthRepo';

import IMailTemplateProvider from './providers/MailTemplateProvider/impl/HandlebarsMailTemplateProvider';
import providersTemplates from './providers/MailTemplateProvider';

import NotificationRepository from '../../modules/notification/repos/impl/typeorm/NotificationRepo';
import { INotificationRepository } from '../../modules/notification/repos/INotification';

// Repositors
container.registerSingleton<ILikeRepository>('LikeRepository', LikeRepository);

container.registerSingleton<ICommentRepository>(
  'CommentRepository',
  CommentRepository,
);

container.registerSingleton<IPostRepository>('PostRepository', PostRepository);
container.registerSingleton<IUserRepository>('UserRepository', UserRepository);

container.registerSingleton<IExternalAuthRepository>(
  'ExternalAuthRepository',
  ExternalAuthRepository,
);

container.registerSingleton<ITokensRepository>(
  'TokensRepository',
  TokensRepository,
);

container.registerSingleton<IHidePostRepository>(
  'HidePostRepository',
  HidePostRepository,
);

container.registerSingleton<INotificationRepository>(
  'NotificationRepository',
  NotificationRepository,
);

// Providers
container.registerSingleton<IMailTemplateProvider>(
  'MailTemplateProvider',
  providersTemplates.handlebars,
);
