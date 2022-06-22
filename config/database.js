const Sequelize = require( 'sequelize' );

const db = new Sequelize( process.env.DATABASE_URL );
db.dialect = 'postgres';
db.native = true;
db.pool = {
    max: 5,
    min: 0,
    acquire: 30000,
    idle: 10000,
};

module.exports = db;