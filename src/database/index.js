import Sequelize from 'sequelize';

import UserProfiles from '../app/models/UserProfiles';

import ApplicationUsers from '../app/models/ApplicationUsers';

import databaseConfig from '../config/database';
import IdentityUserRoles from '../app/models/IdentityUserRoles';
import IdentityRoles from '../app/models/IdentityRoles';
import Groups from '../app/models/Groups';
import Courses from '../app/models/Courses';

import CourseGroups from '../app/models/CourseGroups';
import UserGroups from '../app/models/UserGroups';
import UserCourses from '../app/models/UserCourses';
import GroupRoleUserGroups from '../app/models/GroupRoleUserGroups';
import GroupRoles from '../app/models/GroupRoles';

import FabricoinGiftPortalRecords from '../app/models/FabricoinGiftPortalRecords';
import FabricoinFlowPortalRecords from '../app/models/FabricoinFlowPortalRecords';

const models = [
    UserProfiles,
    ApplicationUsers,
    IdentityUserRoles,
    IdentityRoles,
    Groups,
    Courses,
    CourseGroups,
    UserGroups,
    UserCourses,
    GroupRoles,
    GroupRoleUserGroups,
    FabricoinGiftPortalRecords,
    FabricoinFlowPortalRecords,
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
