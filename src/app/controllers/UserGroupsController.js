import Sequelize from 'sequelize';
import UserProfiles from '../models/UserProfiles';
import CourseGroups from '../models/CourseGroups';
import UserGroups from '../models/UserGroups';
import UserCourses from '../models/UserCourses';
import Groups from '../models/Groups';
import Courses from '../models/Courses';

class UserGroupsController {
    async store(req, res) {
        const { idGroup, idUsers } = req.body;

        if (idUsers !== undefined) {
            await UserGroups.destroy({
                where: {
                    group_id: idGroup,
                },
            });

            const userGroup = {
                group_Id: idGroup,
                userProfile_Id: 0,
                isActive: true,
                timestamp: Sequelize.fn('GETDATE'),
            };

            await idUsers.forEach(async (user) => {
                userGroup.userProfile_Id = user.id;
                await UserGroups.create(userGroup);
            });

            const groupCourses = await CourseGroups.findAll({
                where: {
                    group_id: idGroup,
                },
            });
            const idCourses = [];

            for (let x = 0; x < groupCourses.length; x++) {
                idCourses.push({
                    id: groupCourses[x].course_id,
                });
            }
            console.log(idCourses);
            await idUsers.forEach(async (user) => {
                await UserCourses.destroy({
                    where: {
                        userProfile_Id: user.id,
                    },
                });

                const userCourse = {
                    course_Id: 0,
                    userProfile_Id: user.id,
                    isActive: true,
                    wasAccepted: true,
                    timestamp: Sequelize.fn('GETDATE'),
                };

                await idCourses.forEach(async (course) => {
                    userCourse.course_Id = course.id;
                    await UserCourses.create(userCourse);
                });
            });
        } else {
            return res
                .status(400)
                .json({ message: 'Bad request. User is required.' });
        }

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

        return res.json(group);
    }
}

export default new UserGroupsController();
