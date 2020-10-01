import axios from 'axios';
import Sequelize from 'sequelize';
import UserGroups from '../models/UserGroups';
import CourseGroups from '../models/CourseGroups';
import UserCourses from '../models/UserCourses';
import Groups from '../models/Groups';
// import UserProfiles from '../models/UserProfiles';
import ApplicationUsers from '../models/ApplicationUsers';
import GroupRoleUserGroups from '../models/GroupRoleUserGroups';

class UserGroupCourseController {
    async store(req, res) {
        const { name, email, cellNumber, country, state, idGroup } = req.body;

        const password = email;

        console.log(password);

        const instance = await axios.create({
            baseURL: process.env.APP_URL_API,
            headers: {
                'Content-Type': 'application/json',
            },
        });

        try {
            const userRegister = await instance
                .post('/angular/register', {
                    name,
                    email,
                    cellNumber,
                    country,
                    state,
                    password,
                })
                .catch((error) => {
                    return res.json({ error: 'Server error.', erro: error });
                });
            if (userRegister.data !== '') {
                if (
                    userRegister.data[0] === `Name ${email} is already taken.`
                ) {
                    return res
                        .status(400)
                        .json({ error: `Name ${email} is already taken.` });
                }
            }
        } catch (err) {
            return res.json({ message1: err });
        }

        const user = await ApplicationUsers.findOne({
            where: {
                email,
            },
        });
        console.log(user);
        try {
            const userGroup = {
                group_Id: idGroup,
                userProfile_Id: user.userProfileId,
                isActive: true,
                timestamp: Sequelize.fn('GETDATE'),
            };

            await UserGroups.create(userGroup);
        } catch (err) {
            console.log(err);
            return res.status(401).json({ message: err });
        }
        const idCoursesNewUser = [];

        try {
            const userGroups = await UserGroups.findAll({
                where: {
                    userProfile_Id: user.userProfileId,
                },
            });

            for (const userGroup of userGroups) {
                // console.log(userGroup.group_Id);
                const group = await Groups.findOne({
                    where: {
                        id: userGroup.group_Id,
                    },
                });
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

                        const userCourseNewUser = await UserCourses.findOne({
                            where: {
                                course_id: courseGroup.course_id,
                                userProfile_id: user.userProfileId,
                            },
                        });

                        if (userCourseNewUser) {
                            await userCourseNewUser.update({ isActive: false });
                        }
                    }
                }
            }
        } catch (error) {
            console.log(error);
            return res.status(401).json({ message: error });
        }

        try {
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

            const userCourse = {
                course_Id: 0,
                userProfile_Id: user.userProfileId,
                isActive: true,
                wasAccepted: true,
                timestamp: Sequelize.fn('GETDATE'),
            };

            const courseExistGroupNewUserAndNewGroup = idCourses.filter(
                (course) => idCoursesNewUser.includes(course)
            );

            for (const courseGroup of courseExistGroupNewUserAndNewGroup) {
                const userCourse = await UserCourses.findOne({
                    where: {
                        course_id: courseGroup.course_id,
                        userProfileId: user.userProfileId,
                    },
                });

                if (userCourse) {
                    await userCourse.update({ isActive: true });
                }
            }

            const courseNotExistGroupNewUserAndNewGroup = idCourses.filter(
                (course) => !idCoursesNewUser.includes(course)
            );

            courseNotExistGroupNewUserAndNewGroup.forEach(async (course) => {
                const findUserCourse = await UserCourses.findAll({
                    where: {
                        userProfile_Id: user.userProfileId,
                        course_id: course.id,
                    },
                });

                if (findUserCourse.length === 0) {
                    userCourse.course_Id = course.id;
                    await UserCourses.create(userCourse);
                } else if (findUserCourse.length > 0) {
                    await findUserCourse[0].update({ isActive: true });
                }
            });
        } catch (err) {
            console.log(err);
            return res.status(401).json({ message: err });
        }

        const userGroups = await UserGroups.findAll({
            where: {
                userProfile_Id: user.userProfileId,
                group_Id: idGroup,
            },
            attributes: ['id'],
        });

        const groupUserRole = {
            groupRole_Id: 3,
            userGroup_Id: 0,
        };
        await userGroups.forEach(async (ug) => {
            groupUserRole.userGroup_Id = ug.id;
            await GroupRoleUserGroups.create(groupUserRole);
        });

        return res.json(user);
    }
}

export default new UserGroupCourseController();
