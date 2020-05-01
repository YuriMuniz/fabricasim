import Sequelize, { Model } from 'sequelize';

class UserCourses extends Model {
    static init(sequelize) {
        super.init(
            {
                isActive: Sequelize.BOOLEAN,
                wasAccepted: Sequelize.BOOLEAN,
                timestamp: Sequelize.DataTypes.DATE,
            },
            {
                sequelize,
            }
        );

        return this;
    }

    static associate(models) {
        this.belongsTo(models.Courses, {
            foreignKey: 'course_Id',
            as: 'course',
        });
        this.belongsTo(models.UserProfiles, {
            foreignKey: 'userProfile_Id',
            as: 'user',
        });
    }
}

export default UserCourses;
