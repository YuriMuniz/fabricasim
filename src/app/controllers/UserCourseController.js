import UserCourses from '../models/UserCourses';
import Courses from '../models/Courses';

class UserCouseController {
    async index(req, res) {
        const courses = await UserCourses.findAll({
            where: {
                userProfile_Id: req.query.userCourseId,
            },
            include: [
                {
                    model: Courses,
                    as: 'course',
                },
            ],
        });
        return res.json(courses);
    }
}
export default new UserCouseController();
