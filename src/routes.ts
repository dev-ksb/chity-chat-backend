import { authMiddleware } from './shared/globals/helpers/auth-middleware';
import { serverAdapter } from '@service/queues/base.queue';
import { authRoutes } from '@auth/routes/authRoutes';
import { Application } from 'express';
import { currentUserRoutes } from '@auth/routes/currentRoutes';

const BASE_URL = '/api/v1';

export default (app: Application) => {
  const routes = () => {
    app.use('/queues', serverAdapter.getRouter());
    app.use(BASE_URL, authRoutes.routes());
    app.use(BASE_URL, authRoutes.signoutRoute());

    app.use(BASE_URL, authMiddleware.verifyUser, currentUserRoutes.routes());
  };

  routes();
};
