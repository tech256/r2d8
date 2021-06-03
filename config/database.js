const Sequelize = require( 'sequelize' );
const parse = require( 'pg-connection-string' ).parse;
const config = parse( process.env.DATABASE_URL );

module.exports = new Sequelize(
    config.database,
    config.user,
    config.password,
    {
        define: {
            createdAt: 'createdat',
            updatedAt: 'updatedat',
        },
        host: config.host,
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
