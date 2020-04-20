import Sequelize, { Model } from 'sequelize';

class ApplicationUsers extends Model {
    static init(sequelize) {
        super.init(
            {
                email: Sequelize.STRING,
                userName: Sequelize.STRING,
            },
            {
                sequelize,
            }
        );

        return this;
    }

    static associate(models) {
        this.belongsTo(models.UserProfiles, {
            foreignKey: 'userProfileId',
            as: 'userProfile',
        });
        this.belongsToMany(models.IdentityRoles, {
            through: 'IdentityUserRoles',
            as: 'roles',
            foreignKey: 'userId',
            otherKey: 'roleId',
        });
    }
}

export default ApplicationUsers;
