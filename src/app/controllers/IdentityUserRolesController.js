// import IdentityUserRoles from '../models/IdentityUserRoles';

// import IdentityRoles from '../models/IdentityRoles';
// import ApplicationUsers from '../models/ApplicationUsers';

// class IdentityUserRolesController {
//     async index(req, res) {
//         IdentityUserRoles.removeAttribute('id');
//         IdentityUserRoles.removeAttribute('roleId');
//         IdentityUserRoles.removeAttribute('userId');
//         // IdentityUserRoles.removeAttribute('identityRole_id');
//         IdentityUserRoles.removeAttribute('applicationUser_id');

//         const roleUser = await IdentityUserRoles.findAll({
//             where: {
//                 userId: '21c8c472-eab2-4096-be34-78c2fcdb14a7',
//             },

//             include: [
//                 {
//                     model: IdentityRoles,
//                     as: 'role',
//                     attributes: ['id', 'name'],
//                 },
//                 {
//                     model: ApplicationUsers,
//                     as: 'user',
//                     attributes: ['id', 'email'],
//                 },
//             ],
//         });

//         return res.json(roleUser);
//     }
// }

// export default new IdentityUserRolesController();
