import express from 'express';
import { celebrate, Joi, Segments } from 'celebrate';

import { SwitchLikePostController } from '../../../useCases/likes/switchLikePost';
import ensureAuthenticated from '../../../../../shared/infra/http/middlewares/ensureAuthenticated';

const likeRouter = express.Router();

likeRouter.post(
  '/:id',
  celebrate({
    [Segments.HEADERS]: Joi.object({
      authorization: Joi.string().required(),
    }).unknown(),
    [Segments.PARAMS]: {
      id: Joi.string().required(),
    },
  }),
  ensureAuthenticated,
  (req, res) => SwitchLikePostController.executeImpl(req, res),
);

export default likeRouter;
