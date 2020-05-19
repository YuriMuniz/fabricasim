module.exports = {
    up: (queryInterface, Sequelize) => {
        return queryInterface.createTable('FabricoinFlowPortalRecords', {
            id: {
                type: Sequelize.INTEGER,
                allowNull: false,
                autoIncrement: true,
                primaryKey: true,
            },
            timestamp: {
                allowNull: false,
                type: Sequelize.DATE,
            },
            userProfile_Id: {
                type: Sequelize.INTEGER,
                references: { model: 'userProfiles', key: 'id' },
                onUpdate: 'CASCADE',
                onDelete: 'CASCADE',
                allowNull: false,
            },
            fabricoinAmount: {
                type: Sequelize.DECIMAL(18, 2),
                allowNull: false,
            },
            fabricoinSource: {
                type: Sequelize.INTEGER,
                allowNull: false,
            },
            isActive: {
                type: Sequelize.BOOLEAN,
                allowNull: false,
            },
        });
    },

    down: (queryInterface) => {
        return queryInterface.dropTable('FabricoinFlowPortalRecords');
    },
};
