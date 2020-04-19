import Sequelize, { Model } from 'sequelize';

class IdentityUserRoles extends Model {
    static init(sequelize) {
        super.init(
            {
                identityRole_id: Sequelize.STRING,
                applicationUser_id: Sequelize.STRING,
            },
            {
                sequelize,
            }
        );

        return this;
    }

    static associate(models) {
        this.belongsTo(models.IdentityRoles, {
            foreignKey: 'roleId',
            as: 'role',
        });
        this.belongsTo(models.ApplicationUsers, {
            foreignKey: 'userId',
            as: 'user',
        });
    }
}

export default IdentityUserRoles;
