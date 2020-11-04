import Sequelize from 'sequelize';
import UserProfiles from '../models/UserProfiles';
import CourseGroups from '../models/CourseGroups';
import UserGroups from '../models/UserGroups';
import UserCourses from '../models/UserCourses';
import Groups from '../models/Groups';
import Courses from '../models/Courses';
import GroupRoleUserGroups from '../models/GroupRoleUserGroups';

class UserGroupsController {
    async findByUser(req, res) {
        const { id } = req.query;
        const userGroups = await UserGroups.findAll({
            where: {
                userProfile_Id: id,
                isActive: true,
            },
        });
        return res.json(userGroups);
    }

    async addOneUser(req, res) {
        const { idGroup, userId } = req.body;

        const user = await UserProfiles.findOne({
            where: {
                id: userId,
            },
        });
        if (!user) {
            return res.status(403).json({ message: 'User not exist' });
        }

        const userGroups = await UserGroups.findOne({
            where: {
                group_Id: idGroup,
                userProfile_Id: userId,
            },
        });
        if (userGroups) {
            if (userGroups.isActive) {
                return res
                    .status(403)
                    .json({ message: 'User already exists in the group.' });
            }
            userGroups.update({ isActive: true });
            const groupCourses = await CourseGroups.findAll({
                where: {
                    group_id: idGroup,
                },
            });
            for (let x = 0; x < groupCourses.length; x++) {
                const userCourses = await UserCourses.findOne({
                    where: {
                        course_Id: groupCourses[x].course_id,
                        userProfile_Id: user.id,
                    },
                });
                if (userCourses) {
                    userCourses.update({ isActive: true });
                }
            }
            return res.json({ message: 'Success.' });
        }

        const groupCourses = await CourseGroups.findAll({
            where: {
                group_id: idGroup,
            },
        });
        try {
            const userGroup = {
                group_Id: idGroup,
                userProfile_Id: userId,
                isActive: true,
                timestamp: Sequelize.fn('GETDATE'),
            };
            await UserGroups.create(userGroup);
        } catch (error) {
            return res.json(error);
        }

        const userCourse = {
            course_Id: 0,
            userProfile_Id: user.id,
            isActive: true,
            wasAccepted: true,
            timestamp: Sequelize.fn('GETDATE'),
        };

        for (let x = 0; x < groupCourses.length; x++) {
            const userCourses = await UserCourses.findOne({
                where: {
                    course_Id: groupCourses[x].course_id,
                    userProfile_Id: user.id,
                },
            });
            if (!userCourses) {
                try {
                    userCourse.course_Id = groupCourses[x].course_id;
                    await UserCourses.create(userCourse);
                } catch (error) {
                    return res.json(error);
                }
            }
        }

        return res.json({ message: 'Success' });
    }

    async store(req, res) {
        const { idGroup, idUsers } = req.body;

        const oldUsersGroup = await UserGroups.findAll({
            where: {
                group_id: idGroup,
            },
        });

        if (idUsers !== undefined) {
            // await UserGroups.destroy({
            //     where: {
            //         group_id: idGroup,
            //     },
            // });

            for (const ug of oldUsersGroup) {
                await ug.update({ isActive: false });
            }

            const userGroup = {
                group_Id: idGroup,
                userProfile_Id: 0,
                isActive: true,
                timestamp: Sequelize.fn('GETDATE'),
            };

            for (const user of idUsers) {
                console.log('id:' + user.id);
                const findUserGroup = await UserGroups.findOne({
                    where: {
                        userProfile_Id: user.id,
                        group_id: idGroup,
                    },
                });

                // console.log(findUserGroup.data.userProfile_Id);
                if (findUserGroup === null || findUserGroup === undefined) {
                    userGroup.userProfile_Id = user.id;
                    await UserGroups.create(userGroup);
                } else {
                    console.log('chegou');
                    await findUserGroup.update({ isActive: true });
                    console.log(findUserGroup);
                }
            }

            // await idUsers.forEach(async (user) => {
            //     console.log('id:' +user.id);
            //     const findUserGroup = await UserGroups.findOne({
            //         where: {
            //             userProfile_Id: user.id,
            //             group_id: idGroup,
            //         }
            //     })

            //     //console.log(findUserGroup.data.userProfile_Id);
            //     if(findUserGroup===null || findUserGroup===undefined){
            //         userGroup.userProfile_Id = user.id;
            //         await UserGroups.create(userGroup);
            //     }else{
            //         console.log("chegou");
            //         await findUserGroup.update({isActive: true});
            //     }

            // });

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

            const oldUsers = oldUsersGroup.filter(
                (ug) => !idUsers.includes(ug.userProfile_Id)
            );

            oldUsers.forEach(async (user) => {
                // console.log(user.userProfile_Id);
                // const findUserGroup = await UserGroups.findOne({
                //     where: {
                //         userProfile_Id: user.userProfile_Id,
                //         group_id: idGroup,
                //     }
                // })

                // //console.log(findUserGroup);
                // if(findUserGroup!==null){
                //     await findUserGroup.update({isActive: false});
                // }

                idCourses.forEach(async (course) => {
                    // await UserCourses.destroy({
                    //     where: {
                    //         userProfile_Id: user.userProfile_Id,
                    //         course_id: course.id,
                    //     },
                    // });

                    const userCourse = await UserCourses.findOne({
                        where: {
                            userProfile_Id: user.userProfile_Id,
                            course_id: course.id,
                        },
                    });
                    if (userCourse) {
                        await userCourse.update({ isActive: false });
                    }
                });
            });

            await idUsers.forEach(async (user) => {
                const userCourse = {
                    course_Id: 0,
                    userProfile_Id: user.id,
                    isActive: true,
                    wasAccepted: true,
                    timestamp: Sequelize.fn('GETDATE'),
                };

                const idCoursesNewUser = [];

                try {
                    const userGroups = await UserGroups.findAll({
                        where: {
                            userProfile_Id: user.id,
                        },
                    });

                    for (const userGroup of userGroups) {
                        // console.log(userGroup.group_Id);
                        const group = await Groups.findOne({
                            where: {
                                id: userGroup.group_Id,
                            },
                        });
                        // console.log(group);
                        if (
                            group.groupDescription === 'New_Users_English' ||
                            group.groupDescription === 'New_Users_Portuguese' ||
                            group.groupDescription === 'New_Users_Spanish'
                        ) {
                            userGroup.update({ isActive: false });

                            const coursesGroupNew = await CourseGroups.findAll({
                                where: {
                                    group_id: group.id,
                                },
                            });

                            for (const courseGroup of coursesGroupNew) {
                                idCoursesNewUser.push({
                                    id: courseGroup.id,
                                });

                                const userCourseNewUser = await UserCourses.findOne(
                                    {
                                        where: {
                                            course_id: courseGroup.course_id,
                                            userProfile_id: user.id,
                                        },
                                    }
                                );

                                if (userCourseNewUser) {
                                    await userCourseNewUser.update({
                                        isActive: false,
                                    });
                                }
                            }
                        }
                    }
                } catch (error) {
                    // console.log(error);
                    return res.status(401).json({ message: error });
                }

                try {
                    const courseExistGroupNewUserAndNewGroup = idCourses.filter(
                        (course) => idCoursesNewUser.includes(course)
                    );

                    for (const courseGroup of courseExistGroupNewUserAndNewGroup) {
                        const userCourse = await UserCourses.findOne({
                            where: {
                                course_id: courseGroup.course_id,
                                userProfileId: user.id,
                            },
                        });

                        if (userCourse) {
                            await userCourse.update({ isActive: true });
                        }
                    }

                    const courseNotExistGroupNewUserAndNewGroup = idCourses.filter(
                        (course) => !idCoursesNewUser.includes(course)
                    );

                    courseNotExistGroupNewUserAndNewGroup.forEach(
                        async (course) => {
                            const findUserCourse = await UserCourses.findAll({
                                where: {
                                    userProfile_Id: user.id,
                                    course_id: course.id,
                                },
                            });

                            if (findUserCourse.length === 0) {
                                userCourse.course_Id = course.id;
                                await UserCourses.create(userCourse);
                            } else {
                                await findUserCourse[0].update({
                                    isActive: true,
                                });
                            }
                        }
                    );
                } catch (err) {
                    // console.log(error);
                    return res.status(401).json({ message: error });
                }
            });
        } else {
            return res
                .status(400)
                .json({ message: 'Bad request. User is required.' });
        }

        const userGroups = await UserGroups.findAll({
            where: {
                group_Id: idGroup,
            },
            attributes: ['id'],
        });

        // console.log(userGroups);
        userGroups.forEach(async (ug) => {
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
        userGroups.forEach(async (ug) => {
            groupUserRole.userGroup_Id = ug.id;
            await GroupRoleUserGroups.create(groupUserRole);
        });

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
        // console.log(group);
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
                },
                {
                    model: Courses,
                    as: 'courses',
                },
            ],
        });

        return res.json(group);
    }
}

export default new UserGroupsController();
