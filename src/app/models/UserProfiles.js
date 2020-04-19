import Sequelize, { Model } from 'sequelize';

class UserProfiles extends Model {
    static init(sequelize) {
        super.init(
            {
                userFirstName: Sequelize.STRING,
                userCountry: Sequelize.STRING,
            },
            {
                sequelize,
            }
        );
        return this;
    }
}

export default UserProfiles;
