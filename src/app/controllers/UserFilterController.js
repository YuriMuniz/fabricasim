import Sequelize from 'sequelize';
import ApplicationUsers from '../models/ApplicationUsers';
import UserProfiles from '../models/UserProfiles';
import IdentityRoles from '../models/IdentityRoles';

class UserFilterController {
    async store(req, res) {
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
                // '$roles.id$': idRoles,
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
}

export default new UserFilterController();
