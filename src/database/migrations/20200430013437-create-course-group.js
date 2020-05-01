module.exports = {
    up: (queryInterface, Sequelize) => {
        return queryInterface.createTable('CourseGroups', {
            group_id: {
                primaryKey: true,
                type: Sequelize.INTEGER,
                references: { model: 'groups', key: 'id' },
                onUpdate: 'CASCADE',
                onDelete: 'CASCADE',
                allowNull: false,
            },

            course_id: {
                primaryKey: true,
                type: Sequelize.INTEGER,
                references: { model: 'courses', key: 'id' },
                onUpdate: 'CASCADE',
                onDelete: 'CASCADE',
                allowNull: false,
            },
        });
    },

    down: (queryInterface) => {
        return queryInterface.dropTable('CourseGroups');
    },
};
