require( 'dotenv' ).config();
const http = require( 'http' );

// Create a server object:
const server = http.createServer( function( request, response ) {
    var url = request.url;
    if( url ==='/info' ) {
        var json = {
            'name': `${process.env.ROBOT_NAME}`,
            'status': 'Operational'
        };

        response.setHeader( 'Content-Type', 'application/json' ); // http header
        response.write( JSON.stringify( json ) );
        response.end();
    }
    else {
        response.setHeader( 'Content-Type', 'text/html' ); // http header
        response.write( `<h1>${process.env.ROBOT_NAME}</h1>` );
        response.end();
    }
} );

module.exports = server;