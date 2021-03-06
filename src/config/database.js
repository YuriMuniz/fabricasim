require('dotenv/config');

module.exports = {
    dialect: 'mssql',
    username: process.env.DB_USER,
    password: process.env.DB_PASS,
    host: process.env.DB_HOST,
    database: process.env.DB_NAME,
    define: {
        timestamps: false,
    },
    dialectOptions: {
        options: {
            encrypt: true,
        },
    },
};
