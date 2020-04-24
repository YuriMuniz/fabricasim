import Sequelize, { Model } from 'sequelize';

class UserProfiles extends Model {
    static init(sequelize) {
        super.init(
            {
                userFirstName: Sequelize.STRING,
                userOccupation: Sequelize.STRING,
                userCellNumber: Sequelize.STRING,
                userCountry: Sequelize.STRING,
                userState: Sequelize.STRING,
            },
            {
                sequelize,
            }
        );
        return this;
    }
}

export default UserProfiles;
