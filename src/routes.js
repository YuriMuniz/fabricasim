import { Router } from 'express';
import SessionController from './app/controllers/SessionController';
import UserController from './app/controllers/UserController';

import UserRoleController from './app/controllers/UserRoleController';
import authMiddleware from './app/middlewares/auth';

const routes = new Router();

// Rotas que não precisam de autenticação

routes.post('/sessions', SessionController.store);
routes.post('/users', UserController.store);

// Middleware
routes.use(authMiddleware);

// Rotas que precisam de autenticação

routes.get('/user-role', UserRoleController.index);

export default routes;
