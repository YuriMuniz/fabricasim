// import ApplicationUsers from '../models/ApplicationUsers';

// import UserProfiles from '../models/UserProfiles';

// class ApplicationUsersController {
//     async index(req, res) {
//         const user = await ApplicationUsers.findAll({
//             include: [
//                 {
//                     model: UserProfiles,
//                     as: 'userProfile',
//                     attributes: ['id', 'userFirstName'],
//                 },
//             ],
//         });

//         return res.json(user);
//     }
// }

// export default new ApplicationUsersController();
