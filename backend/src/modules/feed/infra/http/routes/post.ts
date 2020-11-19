import express from 'express';
import { celebrate, Joi, Segments } from 'celebrate';

import { ShowAllPostController } from '../../../useCases/post/showAllPost';
import { CreatePostController } from '../../../useCases/post/createPost';
import { ShowAllUserPostsController } from '../../../useCases/post/showAllUserPosts';
import { SearchPostController } from '../../../useCases/post/searchPost';
import { DeletePostController } from '../../../useCases/post/deletePost';
import { ShowOnePostController } from '../../../useCases/post/showOnePost';
import { ShowAllLikesPostsController } from '../../../useCases/post/showAllLikesPosts';
import { GetAllHidesPostController } from '../../../useCases/post/getAllHidesPost';

import cache from '../../../../../shared/infra/http/middlewares/cacheable';
import ensureAuthenticated from '../../../../../shared/infra/http/middlewares/ensureAuthenticated';

const postRouter = express.Router();

postRouter.get(
  '/',
  cache(5),
  celebrate({
    [Segments.HEADERS]: Joi.object({
      authorization: Joi.string().required(),
    }).unknown(),
    [Segments.QUERY]: {
      page: Joi.number().required(),
    },
  }),
  ensureAuthenticated,
  (req, res) => ShowAllPostController.executeImpl(req, res),
);

postRouter.post(
  '/',
  celebrate({
    [Segments.HEADERS]: Joi.object({
      authorization: Joi.string().required(),
    }).unknown(),
    [Segments.BODY]: Joi.object().keys({
      description: Joi.string().required(),
    }),
  }),
  ensureAuthenticated,
  (req, res) => CreatePostController.executeImpl(req, res),
);

postRouter.get(
  '/search',
  cache(10),
  celebrate({
    [Segments.HEADERS]: Joi.object({
      authorization: Joi.string().required(),
    }).unknown(),
    [Segments.QUERY]: {
      description: Joi.string().required(),
      page: Joi.number().required(),
    },
  }),
  ensureAuthenticated,
  (req, res) => SearchPostController.executeImpl(req, res),
);

postRouter.get(
  '/me',
  cache(10),
  celebrate({
    [Segments.HEADERS]: Joi.object({
      authorization: Joi.string().required(),
    }).unknown(),
    [Segments.QUERY]: {
      page: Joi.number().required(),
    },
  }),
  ensureAuthenticated,
  (req, res) => ShowAllUserPostsController.executeImpl(req, res),
);

postRouter.get(
  '/liked',
  cache(10),
  celebrate({
    [Segments.HEADERS]: Joi.object({
      authorization: Joi.string().required(),
    }).unknown(),
    [Segments.QUERY]: {
      page: Joi.number().required(),
    },
  }),
  ensureAuthenticated,
  (req, res) => ShowAllLikesPostsController.executeImpl(req, res),
);

postRouter.get(
  '/hide',
  cache(10),
  celebrate({
    [Segments.HEADERS]: Joi.object({
      authorization: Joi.string().required(),
    }).unknown(),
    [Segments.QUERY]: {
      page: Joi.number().required(),
    },
  }),
  ensureAuthenticated,
  (req, res) => GetAllHidesPostController.executeImpl(req, res),
);

postRouter.get(
  '/:id',
  cache(15),
  celebrate({
    [Segments.HEADERS]: Joi.object({
      authorization: Joi.string().required(),
    }).unknown(),
    [Segments.PARAMS]: {
      id: Joi.string().required(),
    },
  }),
  ensureAuthenticated,
  (req, res) => ShowOnePostController.executeImpl(req, res),
);

postRouter.delete(
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
  (req, res) => DeletePostController.executeImpl(req, res),
);

export default postRouter;
