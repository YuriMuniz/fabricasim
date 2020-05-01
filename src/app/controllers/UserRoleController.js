import Sequelize from 'sequelize';
import ApplicationUsers from '../models/ApplicationUsers';
import UserProfiles from '../models/UserProfiles';
import IdentityRoles from '../models/IdentityRoles';

import IdentityUserRoles from '../models/IdentityUserRoles';

class UserRoleController {
    async index(req, res) {
        const { email } = req.body;

        const user = await ApplicationUsers.findOne({
            where: {
                userProfileId: req.userId,
            },
            attributes: ['id', 'userName'],
            include: [
                {
                    model: UserProfiles,
                    as: 'userProfile',
                    attributes: ['id', 'userFirstName'],
                },
                {
                    model: IdentityRoles,
                    as: 'roles',
                    attributes: ['id', 'name'],
                    through: {
                        attributes: [],
                    },
                },
            ],
        });

        const values = [];
        const idRoles = [];
        const idRolesNot = [];

        for (let x = 0; x < user.roles.length; x++) {
            values.push(user.roles[x].name);
        }

        if (values.includes('STUDENT')) {
            idRoles.push(-1);
        }
        if (values.includes('TEACHER')) {
            idRoles.length = 0;
            idRoles.push(-1);
        }

        if (values.includes('ADMIN')) {
            idRoles.length = 0;
            idRoles.push(2, 3);
            idRolesNot.push('0', '1', '6');
        }
        if (values.includes('ADMIN+')) {
            idRoles.length = 0;
            idRoles.push(1, 2, 3);
            idRolesNot.push('0', '6');
        }

        if (values.includes('SUPER')) {
            idRoles.length = 0;
            idRoles.push(1, 2, 3, 6);
            idRolesNot.push('');
        }

        if (idRoles.includes(-1)) {
            return res.status(403).json({
                error: 'Student or teacher user does not have permission.',
            });
        }

        if (idRoles.length === 0) {
            return res.json({
                message: 'User does not have any compatible roles.',
            });
        }

        const users = await ApplicationUsers.findAll({
            where: {
                email: {
                    [Sequelize.Op.like]: `%` + email + `%`,
                },
                // '$roles.id$': {
                //     [Sequelize.Op.in]: idRoles,
                // },
            },
            attributes: ['id', 'userName'],
            include: [
                {
                    model: UserProfiles,
                    as: 'userProfile',
                    attributes: ['id', 'userFirstName'],
                },
                {
                    model: IdentityRoles,
                    as: 'roles',
                    attributes: ['id', 'name'],
                    through: {
                        attributes: [],
                    },
                },
            ],
        });
        const usersFilter = [];
        const r = [];

        users.forEach(function (u) {
            for (let x = 0; x < u.roles.length; x++) {
                r.push(u.roles[x].id);
            }
            if (!u.roles.some((e) => idRolesNot.includes(e.id))) {
                usersFilter.push(u);
            }
        });

        return res.json(usersFilter);
    }

    async store(req, res) {
        const { userId, roles } = req.body;

        const user = await ApplicationUsers.findOne({
            where: {
                userProfileId: req.userId,
            },
            attributes: ['id', 'userName'],
            include: [
                {
                    model: UserProfiles,
                    as: 'userProfile',
                    attributes: ['id', 'userFirstName'],
                },
                {
                    model: IdentityRoles,
                    as: 'roles',
                    attributes: ['id', 'name'],
                    through: {
                        attributes: [],
                    },
                },
            ],
        });

        const userRequest = await ApplicationUsers.findOne({
            where: {
                id: userId,
            },
            attributes: ['id', 'userName'],
            include: [
                {
                    model: UserProfiles,
                    as: 'userProfile',
                    attributes: ['id', 'userFirstName'],
                },
                {
                    model: IdentityRoles,
                    as: 'roles',
                    attributes: ['id', 'name'],
                    through: {
                        attributes: [],
                    },
                },
            ],
        });

        if (
            user.roles.some((e) => ['ADMIN'].includes(e.name)) &&
            userRequest.roles.some((e) =>
                ['ADMIN', 'ADMIN+', 'SUPER'].includes(e.name)
            )
        ) {
            return res.status(403).json({ error: 'You don´t have permission' });
        }
        if (
            user.roles.some((e) => ['ADMIN+'].includes(e.name)) &&
            userRequest.roles.some((e) => ['ADMIN+', 'SUPER'].includes(e.name))
        ) {
            return res.status(403).json({ error: 'You don´t have permission' });
        }

        if (
            user.roles.some((e) => ['STUDENT'].includes(e.name)) &&
            user.roles.length === 1
        ) {
            return res.status(403).json({ error: 'You don´t have permission' });
        }

        if (
            user.roles.every((e) => ['STUDENT', 'TEACHER'].includes(e.name)) &&
            user.roles.length === 2
        ) {
            return res.status(403).json({ error: 'You don´t have permission' });
        }

        //---------------------------------------------------------------------------

        if (
            user.roles.some((e) => ['ADMIN'].includes(e.name)) &&
            roles.some((e) => [1, 6, 0].includes(e.id))
        ) {
            return res.status(403).json({ error: 'You don´t have permission' });
        }

        if (
            user.roles.some((e) => ['ADMIN+'].includes(e.name)) &&
            roles.some((e) => [6, 0].includes(e.id))
        ) {
            return res.status(403).json({ error: 'You don´t have permission' });
        }

        const newRoles = roles.filter(function (e, i) {
            return roles.indexOf(e) === i;
        });

        // const roleUserRequestAdminMore = newRoles.some((e) =>
        //     [6].includes(e.id)
        // );
        // const roleUserRequestSuper = newRoles.some((e) => [0].includes(e.id));
        // const roleUserRequestAdmin = newRoles.some((e) => [1].includes(e.id));
        // const roleUserRequestTeacher = newRoles.some((e) => [2].includes(e.id));
        // const roleUserRequestStudent = newRoles.some((e) => [3].includes(e.id));

        // const authorizateLoggedSuper = user.roles.some((e) =>
        //     ['SUPER'].includes(e.name)
        // );

        // const authorizateLoggedAdminMore = user.roles.some((e) =>
        //     ['SUPER', 'ADMIN+'].includes(e.name)
        // );
        // console.log(authorizateLoggedAdminMore);

        // const authorizateLoggedAdmin = user.roles.some((e) =>
        //     ['SUPER', 'ADMIN+', 'ADMIN'].includes(e.name)
        // );

        // const authorizateLoggedStudent =
        //     user.roles.some((e) => ['STUDENT'].includes(e.name)) &&
        //     user.roles.length === 1;

        // const authorizateLoggedTeacher =
        //     user.roles.every((e) => ['STUDENT', 'TEACHER'].includes(e.name)) &&
        //     user.roles.length === 2;

        // if (authorizateLoggedStudent) {
        //     return res
        //         .status(403)
        //         .json({ error: 'You don´t have permission.' });
        // }
        // if (authorizateLoggedTeacher) {
        //     return res.status(403).json({ error: 'You don´t have permission' });
        // }

        // if (roleUserRequestStudent) {
        //     return res
        //         .status(403)
        //         .json({ error: 'Student role cannot be changed' });
        // }

        // if (roleUserRequestSuper) {
        //     return res.status(403).json({ error: 'You don´t have permission' });
        // }

        // if (roleUserRequestAdminMore) {
        //     if (!authorizateLoggedSuper) {
        //         return res
        //             .status(403)
        //             .json({ error: 'You don´t have permission' });
        //     }
        // }
        // if (roleUserRequestAdmin) {
        //     if (!authorizateLoggedAdminMore) {
        //         return res
        //             .status(403)
        //             .json({ error: 'You don´t have permission' });
        //     }
        // }
        // if (roleUserRequestTeacher) {
        //     if (!authorizateLoggedAdmin) {
        //         return res
        //             .status(403)
        //             .json({ error: 'You don´t have permission' });
        //     }
        // }

        await IdentityUserRoles.destroy({
            where: {
                userId,
            },
        });

        newRoles.push({ id: 3 });

        const userRole = {
            userId,
            roleId: 0,
        };

        await newRoles.forEach(async (role) => {
            userRole.roleId = role.id;
            await IdentityUserRoles.create(userRole);
        });

        return res.json({ newRoles });
    }
}

export default new UserRoleController();
