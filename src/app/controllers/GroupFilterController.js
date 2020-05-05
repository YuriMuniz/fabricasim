import Sequelize from 'sequelize';
import Groups from '../models/Groups';
import UserProfiles from '../models/UserProfiles';
import Courses from '../models/Courses';

class GroupFilterController {
    async store(req, res) {
        const { description } = req.body;
        const groups = await Groups.findAll({
            where: {
                groupOwner_Id: req.userId,
                groupDescription: {
                    [Sequelize.Op.like]: `%` + description + `%`,
                },
            },
            order: [['timestamp', 'DESC']],
            include: [
                {
                    model: UserProfiles,
                    as: 'users',
                    through: {
                        attributes: [],
                    },
                },
                {
                    model: Courses,
                    as: 'courses',
                    through: {
                        attributes: [],
                    },
                },
            ],
        });

        return res.json(groups);
    }
}

export default new GroupFilterController();
