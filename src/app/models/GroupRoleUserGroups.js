import { Model } from 'sequelize';

class GroupRoleUserGroups extends Model {
    static init(sequelize) {
        super.init(
            {},
            {
                sequelize,
            }
        );

        return this;
    }

    static associate(models) {
        this.belongsTo(models.GroupRoles, {
            foreignKey: 'groupRole_Id',
            as: 'groupRole',
        });

        this.belongsTo(models.UserGroups, {
            foreignKey: 'userGroup_Id',
            as: 'userGroup',
        });
    }
}

export default GroupRoleUserGroups;
