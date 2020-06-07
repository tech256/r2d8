/**
 * Returns true if the value is empty, otherwise it returns false. The value is deemed to be empty if it is either:
 *
 * null
 * undefined
 * a zero-length array
 * a zero-length string
 */
const isEmpty = function( obj ) {
    return ( obj == null ) || ( obj === '' ) || ( Array.isArray( obj ) && obj.length === 0 );
};

module.exports = {
    isEmpty
}