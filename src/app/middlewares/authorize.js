import jwt from 'jsonwebtoken';

import { promisify } from 'util';
import ApplicationUsers from '../models/ApplicationUsers';
import UserProfiles from '../models/UserProfiles';
import IdentityRoles from '../models/IdentityRoles';

import authConfig from '../../config/auth';

export default function authorize(roles = []) {
    // roles param can be a single role string (e.g. Role.User or 'User')
    // or an array of roles (e.g. [Role.Admin, Role.User] or ['Admin', 'User'])
    if (typeof roles === 'string') {
        roles = [roles];
    }

    return [
        // authenticate JWT token and attach user to request object (req.user)

        // authorize based on user role
        async (req, res, next) => {
            const authHeader = req.headers.authorization;

            if (!authHeader) {
                return res.status(401).json({ error: 'Token not provided' });
            }

            const [, token] = authHeader.split(' ');

            try {
                const decoded = await promisify(jwt.verify)(
                    token,
                    authConfig.secret
                );
                // console.log(decoded.foo);
                req.userId = decoded.id;

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

                if (
                    roles.length &&
                    !user.roles.some((e) => roles.includes(e.name))
                ) {
                    return res.status(401).json({ message: 'Unauthorized' });
                }

                return next();
            } catch (err) {
                return res.status(401).json({ error: 'Token invalid' });
            }
        },
    ];
}
