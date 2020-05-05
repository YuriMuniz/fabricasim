import { Router } from 'express';
import SessionController from './app/controllers/SessionController';
import UserController from './app/controllers/UserController';

import ApplicationUsersController from './app/controllers/ApplicationUsersController';
import UserRoleController from './app/controllers/UserRoleController';

import UserFilterController from './app/controllers/UserFilterController';
// import authMiddleware from './app/middlewares/auth';
import authorize from './app/middlewares/authorize';
import GroupController from './app/controllers/GroupController';
import UserGroupsController from './app/controllers/UserGroupsController';
import UserCourseController from './app/controllers/UserCourseController';
import CourseGroupsController from './app/controllers/CourseGroupsController';
import UserGroupCourseController from './app/controllers/UserGroupCourseController';
import CoursesController from './app/controllers/CoursesController';
import GroupFilterController from './app/controllers/GroupFilterController';

import UserProfilesController from './app/controllers/UserProfilesController';

import roles from './app/util/roles';

const routes = new Router();

// Rotas que não precisam de autenticação

routes.post('/sessions', SessionController.store);
routes.post('/users', UserController.store);

// Middleware
// routes.use(authMiddleware);

// Rotas que precisam de autenticação

routes.put('/users', authorize(), UserController.update);

routes.get('/application-users', authorize(), ApplicationUsersController.index);

routes.get(
    '/user-role',
    authorize([roles.Super, roles.AdminMore, roles.Admin]),
    UserRoleController.index
);
routes.post(
    '/user-role',
    authorize([roles.Super, roles.AdminMore, roles.Admin]),
    UserRoleController.store
);

routes.post(
    '/user-filter',
    authorize([roles.Super, roles.AdminMore, roles.Admin]),
    UserFilterController.store
);

routes.post(
    '/group',
    authorize([roles.Super, roles.AdminMore, roles.Admin]),
    GroupController.store
);

routes.get(
    '/group',
    authorize([roles.Super, roles.AdminMore, roles.Admin]),
    GroupController.index
);

routes.put(
    '/group',
    authorize([roles.Super, roles.AdminMore, roles.Admin]),
    GroupController.update
);

routes.post(
    '/user-group',
    authorize([roles.Super, roles.AdminMore, roles.Admin]),
    UserGroupsController.store
);

routes.get(
    '/user-group',
    authorize([roles.Super, roles.AdminMore, roles.Admin]),
    UserGroupsController.index
);

routes.get(
    '/user-course',
    authorize([roles.Super, roles.AdminMore, roles.Admin]),
    UserCourseController.index
);

routes.post(
    '/course-group',
    authorize([roles.Super, roles.AdminMore, roles.Admin]),
    CourseGroupsController.store
);

routes.post(
    '/user-group-course',
    authorize([roles.Super, roles.AdminMore, roles.Admin]),
    UserGroupCourseController.store
);

routes.get(
    '/courses',
    authorize([roles.Super, roles.AdminMore, roles.Admin]),
    CoursesController.index
);

routes.get(
    '/user-profiles',
    authorize([roles.Super, roles.AdminMore, roles.Admin]),
    UserProfilesController.index
);

routes.post(
    '/group-filter',
    authorize([roles.Super, roles.AdminMore, roles.Admin]),
    GroupFilterController.store
);

export default routes;
