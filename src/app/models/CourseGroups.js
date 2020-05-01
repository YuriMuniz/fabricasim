import { Model } from 'sequelize';

class CourseGroups extends Model {
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
        this.belongsTo(models.Groups, {
            foreignKey: 'group_id',
            as: 'group',
        });

        this.belongsTo(models.Courses, {
            foreignKey: 'course_id',
            as: 'course',
        });
    }
}

export default CourseGroups;
