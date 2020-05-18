import GroupRoleUserGroups from '../models/GroupRoleUserGroups';
import GroupRoles from '../models/GroupRoles';
import UserGroups from '../models/UserGroups';

class GroupRoleUserGroupsController {
    async index(req, res) {
        const { id } = req.query;

        try {
            GroupRoleUserGroups.removeAttribute('id');
            const groupRolesUserGroups = await GroupRoleUserGroups.findAll({
                where: {
                    userGroup_Id: id,
                    // '$roles.id$': idRoles,
                    // '$usergroup.id$': id,
                },
                attributes: ['groupRole_Id', 'userGroup_Id'],
                include: [
                    {
                        model: GroupRoles,
                        as: 'groupRole',
                    },
                    {
                        model: UserGroups,
                        as: 'userGroup',
                    },
                ],
            });
            return res.json(groupRolesUserGroups);
        } catch (err) {
            res.json(err);
        }

        return res.json({ message: 'error' });
    }
}
export default new GroupRoleUserGroupsController();
