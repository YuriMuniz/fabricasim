module.exports = {
    up: (queryInterface, Sequelize) => {
        return queryInterface.createTable('FabricoinGiftPortalRecords', {
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

            fabricoinFlow_Id: {
                type: Sequelize.INTEGER,
                references: { model: 'fabricoinFlowPortalRecords', key: 'id' },

                allowNull: false,
            },
            isActive: {
                type: Sequelize.BOOLEAN,
                allowNull: false,
            },
        });
    },

    down: (queryInterface) => {
        return queryInterface.dropTable('FabricoinGiftPortalRecords');
    },
};
