import ApplicationUsers from '../models/ApplicationUsers';
import UserProfiles from '../models/UserProfiles';
import IdentityRoles from '../models/IdentityRoles';

class ApplicationUsersController {
    async index(req, res) {
        const { id } = req.query;

        const user = await ApplicationUsers.findOne({
            where: {
                userProfileId: id,
            },

            attributes: ['id', 'userName'],
            include: [
                {
                    model: UserProfiles,
                    as: 'userProfile',
                    attributes: ['id', 'userFirstName', 'fabricoinBalance'],
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

export default new ApplicationUsersController();
