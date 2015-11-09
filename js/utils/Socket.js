/**
 * It seems to be pretty difficult to display Oculus Rift scene to the main
 * monitor. At least when using Firefox / WebVR. So I created this websocket
 * based mirroring tool.
 */
var Socket = new Function();

/* Socket mode. Could be master or slave. */
Socket.prototype.mode = "";

/* Received data */
Socket.prototype.data = false;


Socket.prototype.init = function(scene) {


}



/**
 * Open connection to tocket server.
 * @return {[type]} [description]
 */
Socket.prototype.openConnection = function() {

	var self;
	console.log("Open connection.");
	self = this;
	if (typeof this.exampleSocket !== "undefined" && this.exampleSocket && this.exampleSocket.readyState !== 3) {
		console.log("Connection already open. ReadyState: " + this.exampleSocket.readyState);
	}
	this.exampleSocket = new WebSocket("ws://" + window.location.hostname + ":8080");
	this.exampleSocket.onerror = function(e) {
		self.socketClose(e);
	};
	this.exampleSocket.onclose = function(e) {
		self.socketClose(e);
	};
	this.exampleSocket.onopen = function(e) {
		self.socketOpen(e);
	};
	this.exampleSocket.onmessage = function(e) {
		self.socketMessage(e);
	};

};



/**
 * Handle connection open.
 */
Socket.prototype.socketOpen = function() {
  console.log("Socket connection opened.");
  this.exampleSocket.send('{"message":"WebGL godness joined."}');
};



/**
 * Handle socket message.
 */
Socket.prototype.socketMessage = function(event) {
  var data, self;
  self = this;
  // console.log(event.data);
  this.data = JSON.parse(event.data);
};



/**
 * Handle socket close. Open it immediately again.
 */
Socket.prototype.socketClose = function(event) {
  var self;
  self = this;
  return setTimeout(function() {
	return self.openConnection();
  }, 2000);
};



/**
 * Handle post render stuff. There are two modes: master and slave. On master mode
 * builder sends it's data to socket server. On client mode data is read and applied
 * to the builder.
 *
 * @param  {Object) bikeBuilder Bike builder main object.
 * @return {[type]}             [description]
 */
Socket.prototype.handleRender = function(bikeBuilder) {

	// Do nothing if connection is not open.
	if (this.mode == "" || this.exampleSocket.readyState != this.exampleSocket.OPEN) {
		return false;
	}

	// Send scene status.
	if (this.mode == "master") {

		var data = {
			bike: {
				rotation: {
					y: bikeBuilder.bike.obj.rotation.y
				}
			},
			camera: {
				rotation: {
					x: bikeBuilder.camera.rotation.x,
					y: bikeBuilder.camera.rotation.y,
					z: bikeBuilder.camera.rotation.z
				},
				position: {
					x: bikeBuilder.camera.position.x,
					y: bikeBuilder.camera.position.y,
					z: bikeBuilder.camera.position.z
				},
				quaternion: {
					x: bikeBuilder.camera.quaternion.x,
					y: bikeBuilder.camera.quaternion.y,
					z: bikeBuilder.camera.quaternion.z,
					w: bikeBuilder.camera.quaternion.w
				}
			},
			hud: {
				selectedItem: bikeBuilder.hud.selectedItem,
				items: bikeBuilder.hud.items
			},
			colors: {
				frame:  bikeBuilder.hud.items[0].options[ bikeBuilder.hud.items[0].selected ].key,
				saddle: bikeBuilder.hud.items[1].options[ bikeBuilder.hud.items[1].selected ].key,
				tires:  bikeBuilder.hud.items[2].options[ bikeBuilder.hud.items[2].selected ].key
			}
		}
		this.exampleSocket.send(JSON.stringify(data));

	}

	// Receive scene status.
	if (this.mode == "slave") {

		try {
			bikeBuilder.bike.obj.rotation.y = this.data.bike.rotation.y;
			bikeBuilder.camera.rotation.x = this.data.camera.rotation.x;
			bikeBuilder.camera.rotation.y = this.data.camera.rotation.y;
			bikeBuilder.camera.rotation.z = this.data.camera.rotation.z;
			bikeBuilder.camera.position.x = this.data.camera.position.x;
			bikeBuilder.camera.position.y = this.data.camera.position.y;
			bikeBuilder.camera.position.z = this.data.camera.position.z;
			// bikeBuilder.camera.quaternion.x = this.data.camera.position.x;
			// bikeBuilder.camera.quaternion.y = this.data.camera.position.y;
			// bikeBuilder.camera.quaternion.z = this.data.camera.position.z;
			// bikeBuilder.camera.quaternion.w = this.data.camera.position.w;
			bikeBuilder.hud.selectedItem = this.data.hud.selectedItem;
			bikeBuilder.hud.items = this.data.hud.items;
			bikeBuilder.bike.setColor("frame", this.data.colors.frame);
			bikeBuilder.bike.setColor("saddle", this.data.colors.saddle);
			bikeBuilder.bike.setColor("tires", this.data.colors.tires);
		} catch(e) {

		}

	}

}
