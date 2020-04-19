import Sequelize from 'sequelize';

import UserProfiles from '../app/models/UserProfiles';

import ApplicationUsers from '../app/models/ApplicationUsers';

import databaseConfig from '../config/database';
import IdentityUserRoles from '../app/models/IdentityUserRoles';
import IdentityRoles from '../app/models/IdentityRoles';

const models = [
    UserProfiles,
    ApplicationUsers,
    IdentityUserRoles,
    IdentityRoles,
];

class Database {
    constructor() {
        this.init();
    }

    init() {
        this.connection = new Sequelize(databaseConfig);

        models
            .map((model) => model.init(this.connection))
            .map(
                (model) =>
                    model.associate && model.associate(this.connection.models)
            );
    }
}

export default new Database();
