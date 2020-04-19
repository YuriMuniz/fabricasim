import { Router } from 'express';
import SessionController from './app/controllers/SessionController';
import UserController from './app/controllers/UserController';
import UserProfilesController from './app/controllers/UserProfilesController';
import ApplicationUsersController from './app/controllers/ApplicationUsersController';
import IdentityUserRolesController from './app/controllers/IdentityUserRolesController';
import authMiddleware from './app/middlewares/auth';

const routes = new Router();

// Rotas que não precisam de autenticação
routes.post('/sessions', SessionController.store);
routes.post('/users', UserController.store);

routes.use(authMiddleware);

// Rotas que precisam de autenticação
routes.get('/users-profiles', UserProfilesController.index);
routes.get('/application-users', ApplicationUsersController.index);
routes.get('/identity-users-roles', IdentityUserRolesController.index);

export default routes;
