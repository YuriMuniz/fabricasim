import Sequelize, { Model } from 'sequelize';

class Groups extends Model {
    static init(sequelize) {
        super.init(
            {
                groupDescription: Sequelize.STRING,
                groupResume: Sequelize.STRING,
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
        this.belongsTo(models.UserProfiles, {
            foreignKey: 'groupOwner_Id',
            as: 'groupOwner',
        });
        this.belongsToMany(models.Courses, {
            through: 'CourseGroups',
            as: 'courses',
            foreignKey: 'group_id',
            otherKey: 'course_id',
        });
        this.belongsToMany(models.UserProfiles, {
            through: 'UserGroups',
            as: 'users',
            foreignKey: 'group_Id',
            otherKey: 'userProfile_Id',
        });
    }
}

export default Groups;
