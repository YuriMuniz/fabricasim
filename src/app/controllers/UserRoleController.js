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

        for (let x = 0; x < user.roles.length; x++) {
            values.push(user.roles[x].name);
        }

        if (values.includes('STUDENT')) {
            idRoles.push(0);
        }
        if (values.includes('TEACHER')) {
            idRoles.length = 0;
            idRoles.push(0);
        }

        if (values.includes('ADMIN')) {
            idRoles.length = 0;
            idRoles.push(2, 3);
        }
        if (values.includes('ADMIN+')) {
            idRoles.length = 0;
            idRoles.push(1, 2, 3);
        }

        if (values.includes('SUPER')) {
            idRoles.length = 0;
            idRoles.push(1, 2, 3, 6);
        }

        if (idRoles.includes(0)) {
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
                '$roles.id$': idRoles,
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

    async store(req, res) {
        const { userId, roles } = req.body;

        await IdentityUserRoles.destroy({
            where: {
                userId,
            },
        });

        const userRole = {
            userId,
            roleId: 0,
        };

        await roles.forEach(async (role) => {
            userRole.roleId = role.id;
            await IdentityUserRoles.create(userRole);
        });

        return res.json({ roles });
    }
}

export default new UserRoleController();
