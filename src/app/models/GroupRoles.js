import Sequelize, { Model } from 'sequelize';

class GroupRoles extends Model {
    static init(sequelize) {
        super.init(
            {
                groupRoleDescription: Sequelize.STRING,
                isActive: Sequelize.BOOLEAN,
            },
            {
                sequelize,
            }
        );
        return this;
    }
}

export default GroupRoles;
