import Sequelize, { Model } from 'sequelize';

class Courses extends Model {
    static init(sequelize) {
        super.init(
            {
                courseImage: Sequelize.STRING,
                courseDescription: Sequelize.STRING,
                timestamp: Sequelize.DataTypes.DATE,
                isActive: Sequelize.BOOLEAN,
                isDefault: Sequelize.BOOLEAN,
                courseResume: Sequelize.STRING,
                coursePresentationUrl: Sequelize.STRING,
            },
            {
                sequelize,
            }
        );

        return this;
    }
}

export default Courses;
