require('dotenv/config');

module.exports = {
    dialect: 'mssql',

    // dialectModulePath: 'sequelize-msnodesqlv8',

    // dialectOptions: {
    //     driver: 'SQL Server Native Client 11.0',
    //     instanceName: 'SQLEXPRESS',
    //     trustedConnection: true,
    // },

    username: process.env.DB_USER,
    password: process.env.DB_PASS,
    host: process.env.DB_HOST,
    database: process.env.DB_NAME,
    define: {
        timestamps: false,
    },

    // dialectOptions: {
    //     options: {
    //         useUTC: false,
    //         dateFirst: 1,
    //     },
    // },
};
