import UserProfiles from '../models/UserProfiles';
import ApplicationUsers from '../models/ApplicationUsers';
import IdentityRoles from '../models/IdentityRoles';

class UserProfilesController {
    async index(req, res) {
        const { email } = req.query;

        const user = await ApplicationUsers.findOne({
            where: {
                userName: email,
            },

            attributes: ['id', 'userName'],
            include: [
                {
                    model: UserProfiles,
                    as: 'userProfile',
                    attributes: ['id', 'userFirstName', 'userCellNumber'],
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
        return res.json(user);
    }
}

export default new UserProfilesController();
