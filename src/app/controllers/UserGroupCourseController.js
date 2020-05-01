import axios from 'axios';
import Sequelize from 'sequelize';
import UserGroups from '../models/UserGroups';
import CourseGroups from '../models/CourseGroups';
import UserCourses from '../models/UserCourses';
// import UserProfiles from '../models/UserProfiles';
import ApplicationUsers from '../models/ApplicationUsers';

class UserGroupCourseController {
    async store(req, res) {
        const { name, email, cellNumber, country, state, idGroup } = req.body;

        const [password] = email.split('@');

        console.log(password);

        const instance = await axios.create({
            baseURL: process.env.APP_URL_API,
            headers: {
                'Content-Type': 'application/json',
            },
        });

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
            if (userRegister.data[0] === `Name ${email} is already taken.`) {
                return res
                    .status(400)
                    .json({ error: `Name ${email} is already taken.` });
            }
        }

        const user = await ApplicationUsers.findOne({
            where: {
                email,
            },
        });

        console.log(user);
        console.log(user.userProfileId);

        const userGroup = {
            group_Id: idGroup,
            userProfile_Id: user.userProfileId,
            isActive: true,
            timestamp: Sequelize.fn('GETDATE'),
        };

        await UserGroups.create(userGroup);

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

        await idCourses.forEach(async (course) => {
            userCourse.course_Id = course.id;
            await UserCourses.create(userCourse);
        });
        return res.json(user);
    }
}

export default new UserGroupCourseController();
