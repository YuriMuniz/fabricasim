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

        const oldCoursesGroup = await CourseGroups.findAll({
            where: {
                group_id: idGroup,
            },
        });

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

            const oldCourses = oldCoursesGroup.filter(
                (cg) => !idCourses.includes(cg.course_id)
            );

            console.log(oldCourses);

            await idUsers.forEach(async (user) => {
                await oldCourses.forEach(async (course) => {
                    await UserCourses.destroy({
                        where: {
                            userProfile_Id: user.id,
                            course_id: course.course_id,
                        },
                    });
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
