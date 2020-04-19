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
    }
}

export default ApplicationUsers;
