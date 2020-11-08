import express from 'express';

import userRouter from '../../../../modules/users/infra/http/routes';
import postRouter from '../../../../modules/feed/infra/http/routes/post';
import hidePostRouter from '../../../../modules/feed/infra/http/routes/hidePost';
import likeRouter from '../../../../modules/feed/infra/http/routes/likes';
import commentRouter from '../../../../modules/feed/infra/http/routes/comments';
import notificationRouter from '../../../../modules/notification/infra/http/routes';

import ensureAuthenticated from '../middlewares/ensureAuthenticated';

const v1Router = express.Router();

v1Router.get('/status', ensureAuthenticated, (req, res) => {
  return res.json({ status: 'ok' });
});

v1Router.use('/user', userRouter);
v1Router.use('/feed/post', postRouter);
v1Router.use('/comment', commentRouter);
v1Router.use('/feed/post/like', likeRouter);
v1Router.use('/feed/post/hide', hidePostRouter);
v1Router.use('/notification', notificationRouter);

export default v1Router;
