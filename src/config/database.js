require('dotenv/config');

module.exports = {
    dialect: 'mssql',
    host: process.env.DB_HOST,
    username: process.env.DB_USER,
    password: process.env.DB_HOST,
    database: process.env.DB_NAME,
    dialectOptions: {
        options: {
            useUTC: false,
            dateFirst: 1,
        },
    },
};
