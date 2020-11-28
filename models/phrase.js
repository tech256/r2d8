const Sequelize = require( 'sequelize' );
const db = require( '../config/database' );

const Phrase = db.define( 'phrase', {
    message: {
        type: Sequelize.STRING,
        unique: true
    },
    points: {
        type: Sequelize.INTEGER,
    },
} );

module.exports = Phrase;
