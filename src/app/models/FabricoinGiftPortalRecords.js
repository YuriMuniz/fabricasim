import Sequelize, { Model } from 'sequelize';

class FabricoinGiftPortalRecords extends Model {
    static init(sequelize) {
        super.init(
            {
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
        this.belongsTo(models.FabricoinFlowPortalRecords, {
            foreignKey: 'fabricoinFlow_Id',
            as: 'fabricoinFlows',
        });
    }
}

export default FabricoinGiftPortalRecords;
