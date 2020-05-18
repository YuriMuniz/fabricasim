import Courses from '../models/Courses';

class CoursesController {
    async index(req, res) {
        const courses = await Courses.findAll({
            order: [['courseDescription', 'ASC']],
        });

        return res.json(courses);
    }
}

export default new CoursesController();
