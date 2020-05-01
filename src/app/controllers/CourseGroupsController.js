import Sequelize from 'sequelize';
import CourseGroups from '../models/CourseGroups';
import UserGroups from '../models/UserGroups';
import UserCourses from '../models/UserCourses';
import UserProfiles from '../models/UserProfiles';
import Groups from '../models/Groups';
import Courses from '../models/Courses';

class CourseGroupsController {
    async store(req, res) {
        const { idGroup, idCourses } = req.body;

        if (idCourses !== undefined) {
            await CourseGroups.destroy({
                where: {
                    group_id: idGroup,
                },
            });

            const courseGroup = {
                group_id: idGroup,
                course_id: 0,
            };

            await idCourses.forEach(async (course) => {
                courseGroup.course_id = course.id;
                await CourseGroups.create(courseGroup);
            });

            const userGroup = await UserGroups.findAll({
                where: {
                    group_id: idGroup,
                },
            });
            const idUsers = [];

            for (let x = 0; x < userGroup.length; x++) {
                idUsers.push({
                    id: userGroup[x].userProfile_Id,
                });
            }

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

export default new CourseGroupsController();
