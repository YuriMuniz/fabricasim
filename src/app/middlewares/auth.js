import jwt from 'jsonwebtoken';

import { promisify } from 'util';
import ApplicationUsers from '../models/ApplicationUsers';
import UserProfiles from '../models/UserProfiles';
import IdentityRoles from '../models/IdentityRoles';

import authConfig from '../../config/auth';

export default async (req, res, next) => {
    const authHeader = req.headers.authorization;

    if (!authHeader) {
        return res.status(401).json({ error: 'Token not provided' });
    }

    const [, token] = authHeader.split(' ');

    try {
        const decoded = await promisify(jwt.verify)(token, authConfig.secret);

        req.userId = decoded.id;
        // console.log(decoded);

        const user = await ApplicationUsers.findOne({
            where: {
                userProfileId: decoded.id,
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

        req.roles = user.roles;

        return next();
    } catch (err) {
        return res.status(401).json({ error: 'Token invalid' });
    }
};
