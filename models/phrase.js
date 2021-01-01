const Sequelize = require( 'sequelize' );
const db = require( '../config/database' );

const Phrase = db.define( 'phrase', {
    message: {
        type: Sequelize.STRING,
        allowNull: false,
        unique: true
    },
    points: {
        type: Sequelize.INTEGER,
        allowNull: false
    },
} );

module.exports = Phrase;
