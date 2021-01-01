const Sequelize = require( 'sequelize' );
module.exports = new Sequelize(
    process.env.DB_NAME,
    process.env.DB_USER,
    process.env.DB_PASS,
    {
        define: {
            createdAt: 'createdat',
            updatedAt: 'updatedat',
        },
        host: process.env.DB_HOST,
        dialect: 'postgres',
        native: true,

        pool: {
            max: 5,
            min: 0,
            acquire: 30000,
            idle: 10000,
        },
    }
);
