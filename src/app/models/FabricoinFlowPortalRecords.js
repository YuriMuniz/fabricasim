import Sequelize, { Model } from 'sequelize';

class FabricoinFlowPortalRecords extends Model {
    static init(sequelize) {
        super.init(
            {
                fabricoinSource: Sequelize.INTEGER,
                fabricoinAmount: Sequelize.STRING,
                timestamp: Sequelize.DataTypes.DATE,
                isActive: Sequelize.BOOLEAN,
            },
            {
                sequelize,
            }
        );

        return this;
    }

    static associate(models) {
        this.belongsTo(models.UserProfiles, {
            foreignKey: 'userProfile_Id',
            as: 'user',
        });
    }
}

export default FabricoinFlowPortalRecords;
