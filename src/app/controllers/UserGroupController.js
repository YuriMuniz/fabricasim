// import Sequelize from 'sequelize';
// import Groups from '../models/Groups';
// import CourseGroups from '../models/CourseGroups';
// import Courses from '../models/Courses';
// import UserGroups from '../models/UserGroups';
// import UserCourses from '../models/UserCourses';
// import UserProfiles from '../models/UserProfiles';

// class UserGroupController {
//     async index(req, res) {
//         const isActive = true;

//         const groups = await Groups.findAll({
//             where: {
//                 groupOwner_Id: req.userId,
//                 isActive,
//             },
//             include: [
//                 {
//                     model: UserProfiles,
//                     as: 'users',
//                     through: {
//                         attributes: [],
//                     },
//                 },
//                 {
//                     model: Courses,
//                     as: 'courses',
//                     through: {
//                         attributes: [],
//                     },
//                 },
//             ],
//         });

//         return res.json({
//             groups,
//         });

//         // return res.status(401).json({ message: 'user has no groups' });
//     }

//     async store(req, res) {
//         const { groupDescription, groupResume, coursesId } = req.body;
//         console.log(coursesId);
//         const groupOwner_Id = req.userId;
//         const isActive = true;
//         // const timestamp = new Date();
//         const g = {
//             groupDescription,
//             groupResume,
//             isActive,
//             timestamp: Sequelize.fn('GETDATE'),
//             groupOwner_Id,
//         };

//         try {
//             await Groups.create(g);
//         } catch (err) {
//             return res.status(401).json({ error: err });
//         }
//         try {
//             const group = await Groups.findOne({
//                 where: {
//                     groupOwner_Id,
//                     isActive,
//                 },
//                 order: [['timestamp', 'DESC']],
//             });

//             const courseGroup = {
//                 group_id: group.id,
//                 course_id: 0,
//             };

//             if (coursesId !== undefined) {
//                 await coursesId.forEach(async (courses) => {
//                     courseGroup.course_id = courses.id;
//                     await CourseGroups.create(courseGroup);
//                 });
//             }

//             return res.json(group);
//         } catch (err) {
//             return res.status(401).json({ error: err });
//         }
//     }

//     async update(req, res) {
//         const {
//             idGroup,
//             idCourses,
//             idUsers,
//             groupDescription,
//             groupResume,
//         } = req.body;

//         console.log(idCourses);
//         console.log(idUsers);

//         if (idCourses !== undefined) {
//             await CourseGroups.destroy({
//                 where: {
//                     group_id: idGroup,
//                 },
//             });

//             const courseGroup = {
//                 group_id: idGroup,
//                 course_id: 0,
//             };

//             await idCourses.forEach(async (course) => {
//                 courseGroup.course_id = course.id;
//                 await CourseGroups.create(courseGroup);
//             });
//         }

//         if (idUsers !== undefined) {
//             await UserGroups.destroy({
//                 where: {
//                     group_id: idGroup,
//                 },
//             });

//             const userGroup = {
//                 group_Id: idGroup,
//                 userProfile_Id: 0,
//                 isActive: true,
//                 timestamp: Sequelize.fn('GETDATE'),
//             };

//             await idUsers.forEach(async (user) => {
//                 userGroup.userProfile_Id = user.id;
//                 await UserGroups.create(userGroup);
//             });

//             await idUsers.forEach(async (user) => {
//                 await UserCourses.destroy({
//                     where: {
//                         userProfile_Id: user.id,
//                     },
//                 });

//                 const userCourse = {
//                     course_Id: 0,
//                     userProfile_Id: user.id,
//                     isActive: true,
//                     wasAccepted: true,
//                     timestamp: Sequelize.fn('GETDATE'),
//                 };

//                 await idCourses.forEach(async (course) => {
//                     userCourse.course_Id = course.id;
//                     await UserCourses.create(userCourse);
//                 });
//             });
//         }

//         const group = await Groups.findOne({
//             where: {
//                 id: idGroup,
//             },

//             include: [
//                 {
//                     model: Courses,
//                     as: 'courses',
//                     through: {
//                         attributes: [],
//                     },
//                 },
//                 {
//                     model: UserProfiles,
//                     as: 'users',
//                     through: {
//                         attributes: [],
//                     },
//                 },
//             ],
//         });

//         group.groupDescription = groupDescription;
//         group.groupResume = groupResume;

//         await group.update(group);

//         return res.json(group);
//     }
// }

// export default new UserGroupController();
