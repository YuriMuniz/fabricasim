import Sequelize, { Model } from 'sequelize';

class IdentityRoles extends Model {
    static init(sequelize) {
        super.init(
            {
                name: Sequelize.STRING,
            },
            {
                sequelize,
            }
        );
        return this;
    }
}

export default IdentityRoles;
