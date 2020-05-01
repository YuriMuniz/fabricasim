import Sequelize, { Model } from 'sequelize';

class UserGroups extends Model {
    static init(sequelize) {
        super.init(
            {
                isActive: Sequelize.BOOLEAN,
                timestamp: Sequelize.DataTypes.DATE,
            },
            {
                sequelize,
            }
        );

        return this;
    }

    static associate(models) {
        this.belongsTo(models.Groups, {
            foreignKey: 'group_Id',
            as: 'group',
        });
        this.belongsTo(models.UserProfiles, {
            foreignKey: 'userProfile_Id',
            as: 'user',
        });
    }
}

export default UserGroups;
