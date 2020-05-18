import Sequelize from 'sequelize';
import UserProfiles from '../models/UserProfiles';
import CourseGroups from '../models/CourseGroups';
import UserGroups from '../models/UserGroups';
import UserCourses from '../models/UserCourses';
import Groups from '../models/Groups';
import Courses from '../models/Courses';
import GroupRoleUserGroups from '../models/GroupRoleUserGroups';

class UserGroupsController {
    async store(req, res) {
        const { idGroup, idUsers } = req.body;

        const oldUsersGroup = await UserGroups.findAll({
            where: {
                group_id: idGroup,
            },
        });

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
            // const oldCourses = groupCourses.filter((cg) =>
            //     idCourses.includes(cg.course_id)
            // );

            const oldUsers = oldUsersGroup.filter(
                (ug) => !idUsers.includes(ug.userProfile_Id)
            );

            await oldUsers.forEach(async (user) => {
                await idCourses.forEach(async (course) => {
                    await UserCourses.destroy({
                        where: {
                            userProfile_Id: user.userProfile_Id,
                            course_id: course.id,
                        },
                    });
                });
            });

            // console.log(idCourses);
            await idUsers.forEach(async (user) => {
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

        // await idUsers.forEach(async (user) => {
        //     const userGroups = await UserGroups.findAll({
        //         where: {
        //             userProfile_Id: user.id,
        //             group_Id: idGroup,
        //         },
        //         attributes: ['id'],
        //     });

        //     console.log(userGroups);
        //     await userGroups.forEach(async (ug) => {
        //         await GroupRoleUserGroups.destroy({
        //             where: {
        //                 userGroup_Id: ug.id,
        //             },
        //         });
        //     });
        // });

        const userGroups = await UserGroups.findAll({
            where: {
                group_Id: idGroup,
            },
            attributes: ['id'],
        });

        console.log(userGroups);
        await userGroups.forEach(async (ug) => {
            await GroupRoleUserGroups.destroy({
                where: {
                    userGroup_Id: ug.id,
                },
            });
        });

        const groupUserRole = {
            groupRole_Id: 3,
            userGroup_Id: 0,
        };
        await userGroups.forEach(async (ug) => {
            groupUserRole.userGroup_Id = ug.id;
            await GroupRoleUserGroups.create(groupUserRole);
        });

        // await idUsers.forEach(async (user) => {
        //     const userGroups = await UserGroups.findAll({
        //         where: {
        //             userProfile_Id: user.id,
        //             group_Id: idGroup,
        //         },
        //         attributes: ['id'],
        //     });

        //     const groupUserRole = {
        //         groupRole_Id: 3,
        //         userGroup_Id: 0,
        //     };
        //     await userGroups.forEach(async (ug) => {
        //         groupUserRole.userGroup_Id = ug.id;
        //         await GroupRoleUserGroups.create(groupUserRole);
        //     });
        // });

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

    async index(req, res) {
        const { id } = req.query;

        const group = await Groups.findOne({
            where: {
                id,
            },
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

        return res.json(group);
    }
}

export default new UserGroupsController();
