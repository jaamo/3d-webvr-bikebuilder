var util = require('util');

/******************************************************************************
 *                                 SOCKET SERVER                              *
 ******************************************************************************/

 console.log("Server listening on port 8080.");


var WebSocketServer = require('ws').Server
  , wss = new WebSocketServer({port: 8080});

/**
 * Connection opened.
 */
wss.on('connection', function(ws) {

	console.log("Server ready on port 8080.");

	/**
	 * Broadcast every received message.
	 */
    ws.on('message', function(message) {
	    wss.broadcast(message);
    });

});


/**
 * Broadcast method.
 */
wss.broadcast = function(data) {
    console.log("Broadcasting message to " + this.clients.length + " clients: " + data);
    for (var i in this.clients) {
        if (this.clients[i].readyState == this.clients[i].OPEN) {
            this.clients[i].send(data);
        }
    }
};
