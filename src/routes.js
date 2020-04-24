import { Router } from 'express';
import SessionController from './app/controllers/SessionController';
import UserController from './app/controllers/UserController';

import ApplicationUsersController from './app/controllers/ApplicationUsersController';
import UserRoleController from './app/controllers/UserRoleController';

import UserFilterController from './app/controllers/UserFilterController';
import authMiddleware from './app/middlewares/auth';

const routes = new Router();

// Rotas que não precisam de autenticação

routes.post('/sessions', SessionController.store);
routes.post('/users', UserController.store);

// Middleware
routes.use(authMiddleware);

// Rotas que precisam de autenticação

routes.put('/users', UserController.update);

routes.get('/application-users', ApplicationUsersController.index);

routes.get('/user-role', UserRoleController.index);
routes.post('/user-role', UserRoleController.store);

routes.post('/user-filter', UserFilterController.store);

export default routes;
