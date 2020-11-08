import express from 'express';
import { celebrate, Joi, Segments } from 'celebrate';

import { GetAllNotificationsController } from '../../../useCase/getAllNotifications';
import { GetCountNotificationNotReadController } from '../../../useCase/getCountNotificationNotRead';
import { ClearNotificationController } from '../../../useCase/clearNotification';
import ensureAuthenticated from '../../../../../shared/infra/http/middlewares/ensureAuthenticated';

const notificationRouter = express.Router();

notificationRouter.get(
  '/',
  celebrate({
    [Segments.HEADERS]: Joi.object({
      authorization: Joi.string().required(),
    }).unknown(),
  }),
  ensureAuthenticated,
  (req, res) => GetAllNotificationsController.executeImpl(req, res),
);

notificationRouter.get(
  '/read',
  celebrate({
    [Segments.HEADERS]: Joi.object({
      authorization: Joi.string().required(),
    }).unknown(),
  }),
  ensureAuthenticated,
  (req, res) => GetCountNotificationNotReadController.executeImpl(req, res),
);

notificationRouter.post(
  '/read',
  celebrate({
    [Segments.HEADERS]: Joi.object({
      authorization: Joi.string().required(),
    }).unknown(),
  }),
  ensureAuthenticated,
  (req, res) => ClearNotificationController.executeImpl(req, res),
);

export default notificationRouter;
