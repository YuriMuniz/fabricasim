import Sequelize from 'sequelize';
import Groups from '../models/Groups';
import Courses from '../models/Courses';
import UserProfiles from '../models/UserProfiles';
import CourseGroups from '../models/CourseGroups';
import ApplicationUsers from '../models/ApplicationUsers';
import IdentityRoles from '../models/IdentityRoles';

class GroupController {
    async index(req, res) {
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
        const isActive = true;

        console.log(user.roles);
        const authorizateAdminMore = user.roles.some((e) =>
            ['SUPER', 'ADMIN+'].includes(e.name)
        );
        const authorizateAdmin = user.roles.some((e) =>
            ['ADMIN'].includes(e.name)
        );

        if (authorizateAdminMore) {
            const groups = await Groups.findAll({
                where: {
                    isActive,
                },
                order: [['timestamp', 'DESC']],
                include: [
                    {
                        model: UserProfiles,
                        as: 'groupOwner',
                    },
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

            return res.json({
                groups,
            });
        }

        if (authorizateAdmin) {
            const groups = await Groups.findAll({
                where: {
                    groupOwner_Id: req.userId,
                    isActive,
                },
                order: [['timestamp', 'DESC']],
                include: [
                    {
                        model: UserProfiles,
                        as: 'groupOwner',
                    },
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

            return res.json({
                groups,
            });
        }

        return res.status(403).json({ message: 'Unauthorized' });
    }

    async store(req, res) {
        const { groupDescription, groupResume, coursesId } = req.body;
        console.log(coursesId);
        const groupOwner_Id = req.userId;
        const isActive = true;
        // const timestamp = new Date();
        const g = {
            groupDescription,
            groupResume,
            isActive,
            timestamp: Sequelize.fn('GETDATE'),
            groupOwner_Id,
        };

        try {
            await Groups.create(g);
        } catch (err) {
            return res.status(401).json({ error: err });
        }
        try {
            const group = await Groups.findOne({
                where: {
                    groupOwner_Id,
                    isActive,
                },
                order: [['timestamp', 'DESC']],
            });

            const courseGroup = {
                group_id: group.id,
                course_id: 0,
            };

            if (coursesId !== undefined) {
                await coursesId.forEach(async (courses) => {
                    courseGroup.course_id = courses.id;
                    await CourseGroups.create(courseGroup);
                });
            }

            return res.json(group);
        } catch (err) {
            return res.status(401).json({ error: err });
        }
    }

    async update(req, res) {
        const { idGroup, groupDescription, groupResume } = req.body;

        const group = await Groups.findOne({
            where: {
                id: idGroup,
            },

            include: [
                {
                    model: Courses,
                    as: 'courses',
                    through: {
                        attributes: [],
                    },
                },
                {
                    model: UserProfiles,
                    as: 'users',
                    through: {
                        attributes: [],
                    },
                },
            ],
        });

        group.groupDescription = groupDescription;
        group.groupResume = groupResume;

        try {
            await group.update({
                groupDescription,
                groupResume,
            });
        } catch (err) {
            return res.status(401).json({ message: err });
        }

        return res.json(group);
    }
}

export default new GroupController();
