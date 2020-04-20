import Sequelize from 'sequelize';
import ApplicationUsers from '../models/ApplicationUsers';
import UserProfiles from '../models/UserProfiles';
import IdentityRoles from '../models/IdentityRoles';

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

        for (let x = 0; x < user.roles.length; x++) {
            values.push(user.roles[x].name);
        }

        // Usuário SUPER lista os usuários por email
        // que possuem roles ADMIN+(6) ,ADMIN (1), TEACHER(2), STUDENT(3)

        if (values.includes('SUPER')) {
            const users = await ApplicationUsers.findAll({
                where: {
                    email: {
                        [Sequelize.Op.like]: `%` + email + `%`,
                    },
                    '$roles.id$': [1, 2, 3, 6],
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

            return res.json(users);
        }

        // Usuário ADMIN+ lista os usuários por email
        // que possuem roles ADMIN (1), TEACHER(2), STUDENT(3)

        if (values.includes('ADMIN+')) {
            const users = await ApplicationUsers.findAll({
                where: {
                    email: {
                        [Sequelize.Op.like]: `%` + email + `%`,
                    },
                    '$roles.id$': [1, 2, 3],
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

            return res.json(users);
        }

        // Usuário ADMIN lista os usuários por email
        // que possuem roles TEACHER(2), STUDENT(3)

        if (values.includes('ADMIN')) {
            const users = await ApplicationUsers.findAll({
                where: {
                    email: {
                        [Sequelize.Op.like]: `%` + email + `%`,
                    },
                    '$roles.id$': [2, 3],
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

            return res.json(users);
        }

        // Usuário TEACHER lista os usuários por email
        // que possuem roles TEACHER(2), STUDENT(3)

        if (values.includes('TEACHER')) {
            const users = await ApplicationUsers.findAll({
                where: {
                    email: {
                        [Sequelize.Op.like]: `%` + email + `%`,
                    },
                    '$roles.id$': [2, 3],
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

            return res.json(users);
        }

        if (values.includes('STUDENT')) {
            return res
                .status(403)
                .json({ error: 'Student user does not have permission.' });
        }

        return res.json({
            message: 'User does not have any compatible roles.',
        });
    }
}

export default new UserRoleController();
