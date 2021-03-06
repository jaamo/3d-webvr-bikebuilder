// This trick allows ColladaLoader to load cross domain textures.
// Sure I'm opening bunch of security holes here, so I just
// close my eyes, smile and go forward.
THREE.ImageLoader.prototype.crossOrigin = "Anonymous";


/**
 * 3D scene.
 */
var BikeBuilder = new Function();



/* Essential 3D scene objects. */
BikeBuilder.prototype.scene = {};
BikeBuilder.prototype.camera = {};
BikeBuilder.prototype.renderer = {};
BikeBuilder.prototype.clock = {};
BikeBuilder.prototype.light = {};

/* Control mode. */
// BikeBuilder.prototype.vrControlsEnabled = false;

/* Gamepad input with keyboard fallback. */
BikeBuilder.prototype.gamepadControls = {};

/* WebVR controls and effect. */
// BikeBuilder.prototype.vrControls = {};
// BikeBuilder.prototype.vrEffect = {};
// BikeBuilder.prototype.vrEnabled = false;

/* Dimensions */
BikeBuilder.prototype.width = window.innerWidth;
BikeBuilder.prototype.height = window.innerHeight;

/* Websocket handler. */
// BikeBuilder.prototype.socket = false;



/**
 * Init scene.
 */
BikeBuilder.prototype.init = function init(scene, camera, renderer, clock, gamepadControls, loadCallback) {

	// Oculus or not.
	// if ($.urlParam("vr") == "true") {
	// 	this.vrControlsEnabled = true;
	// }

	this.scene = scene;
	this.camera = camera;
	this.renderer = renderer;
	this.clock = clock;
	this.gamepadControls = gamepadControls;
	// this.socket = socket;

	// this.scene = new THREE.Scene();
	// this.initRenderer();
	// this.initVR();
	// this.initClock();
	// this.initControls();
	// this.initSocket();
    // this.initCamera();

	this.initRenderer();
	this.initLight();
	this.initFloor();
	this.initLogo();
	this.initShapes(function() {
		loadCallback();
	}); // <- triggers render loop when load complete

	// this.render();

};



/**
 * Init camera.
 */
BikeBuilder.prototype.initRenderer = function() {
	this.renderer.setClearColor( 0xffffff , 1 );
}



/**
 * Init camera.
 */
BikeBuilder.prototype.initCamera = function() {

	this.camera = new THREE.PerspectiveCamera( 75, this.width / this.height, 0.3, 10000 );
	this.camera.position.y = 228;
	this.camera.position.z = 496;
	this.camera.position.x = 261;

	// Add orbital controls.
	if (!this.vrControlsEnabled) {

		this.controls = new THREE.OrbitControls( this.camera, this.renderer.domElement );
		this.controls.enableDamping = true;
		this.controls.dampingFactor = 0.25;
		this.controls.enableZoom = false;
		this.controls.minPolarAngle = 0;
		this.controls.maxPolarAngle = Math.PI * 0.55;

	}

};



/**
 * Lights.
 */
BikeBuilder.prototype.initLight = function() {

    // Shadow.
	this.shadowlight = new THREE.DirectionalLight( 0xffffff, 1.8 );
	this.shadowlight.position.set( 0, 200, 0 );
	this.shadowlight.castShadow = true;
	this.shadowlight.shadowDarkness = 0.2;
	this.shadowlight.shadowMapWidth = 1024; // default is 512
	this.shadowlight.shadowMapHeight = 1024; // default is 512
	this.scene.add(this.shadowlight);

	// Main light.
	this.light = new THREE.PointLight(0xffffff, 1, 1000, 1);
	this.light.position.set( 0, 300, 200 );
	this.scene.add(this.light);

	// var light2 = new THREE.PointLight(0xffffff, 1.2, 500, 1)
	// light2.position.set( 0, 100, 200 );
	// this.scene.add(light2);
	//
	// var light3 = new THREE.PointLight(0xffffff, 1.2, 500, 1)
	// light3.position.set( 0, 100, -200 );
	// this.scene.add(light3);

};



/**
 * Floor.
 */
BikeBuilder.prototype.initFloor = function() {

	var geometry = new THREE.PlaneGeometry( 500, 500, 1, 1 );

	//var geometry = new THREE.CylinderGeometry( 600, 600, 20, 32 );

	var material = new THREE.MeshBasicMaterial( { color: 0xffffff, side: THREE.FrontSide } );
	var floor = new THREE.Mesh( geometry, material );

	floor.material.side = THREE.DoubleSide;
	floor.position.y = -210;
	floor.rotation.x = 90*Math.PI/180;
	floor.rotation.y = 0;
	floor.rotation.z = 0;
	floor.doubleSided = true;
	floor.receiveShadow = true;
	this.scene.add(floor);

};




/**
 * Floor.
 */
BikeBuilder.prototype.initLogo = function() {

	var geometry2 = new THREE.PlaneGeometry( 1000, 1000, 1, 1 );

	var texture2 = THREE.ImageUtils.loadTexture( "img/evermade-hamburger-white.jpg" );
	texture2.wrapS = THREE.RepeatWrapping;
	texture2.wrapT = THREE.RepeatWrapping;
	texture2.repeat.set(1, 1);

	var material2 = new THREE.MeshBasicMaterial({
		map: texture2,
		side: THREE.DoubleSide
	});

	var logo2 = new THREE.Mesh( geometry2, material2 );

	logo2.material.side = THREE.DoubleSide;
	logo2.position.z = 5000;
	logo2.rotation.y = Math.PI;
	logo2.doubleSided = true;
	this.scene.add(logo2);

}



/**
 * Shapes.
 */
BikeBuilder.prototype.initShapes = function(callback) {

	var self = this;

	// Initialize bike.
	this.bike = new Bike()
	this.bike.init(this.scene, function() {

		console.log("Reset colors");
		for (var i in self.hud.items) {
			self.bike.setColor(self.hud.items[i].key, self.hud.items[i].options[0].key);
		}

		// Init photowall.
		// self.someWall = new SomeWall();
		// self.someWall.init(self.scene);

		callback();

		// self.render();

	});
	// self.someWall = new SomeWall();
	// self.someWall.init(self.scene);

	// Hub.
	this.hud = new HUD();
	this.hud.init(this.scene, this.camera);

	// this.lensFlare = new LensFlare();
	// this.lensFlare.init(this.scene);

};



/**
 * Render method.
 */
BikeBuilder.prototype.render = function() {

	var delta = this.clock.getDelta();
	var elapsed = this.clock.getElapsedTime();

	// Socket pre render routines.
	// this.socket.handleRender(this);

	// Handle bike rotation.
	if (this.gamepadControls.active("axis1left") > 0) {
		this.bike.obj.rotation.y += (Math.PI / 2) * delta * this.gamepadControls.active("axis1left");
	}
	if (this.gamepadControls.active("axis1right") > 0) {
		this.bike.obj.rotation.y -= (Math.PI / 2) * delta * this.gamepadControls.active("axis1right");
	}

	// if (this.gamepadControls.active("axis3up") > 0) { this.hud.keyUp = true; } else { this.hud.keyUp = false; }
	// if (this.gamepadControls.active("axis3down") > 0) { this.hud.keyDown = true; } else { this.hud.keyDown = false; }
	// if (this.gamepadControls.active("axis3left") > 0) { this.hud.keyLeft = true; } else { this.hud.keyLeft = false; }
	// if (this.gamepadControls.active("axis3right") > 0) { this.hud.keyRight = true; } else { this.hud.keyRight = false; }

	// Handle menu events.
	this.gamepadControls.initPressed();

	if (this.gamepadControls.pressed("button1") || this.gamepadControls.pressed("button0")) {
		this.hud.toggleOption(0);
		this.bike.setColor(this.hud.getItemLabel(0), this.hud.getItemOptionKey(0));
	}
	if (this.gamepadControls.pressed("button2")) {
		this.hud.toggleOption(1);
		this.bike.setColor(this.hud.getItemLabel(1), this.hud.getItemOptionKey(1));
	}
	if (this.gamepadControls.pressed("button3")) {
		this.hud.toggleOption(2);
		this.bike.setColor(this.hud.getItemLabel(2), this.hud.getItemOptionKey(2));
	}

	/*
	if (this.gamepadControls.pressed("axis3up")) {
		this.hud.previousItem();
	}
	if (this.gamepadControls.pressed("axis3down")) {
		this.hud.nextItem();
	}
	if (this.gamepadControls.pressed("axis3left")) {
		this.hud.previousOption();
		this.bike.setColor(this.hud.getItem(), this.hud.getOption());
	}
	if (this.gamepadControls.pressed("axis3right")) {
		var options = this.hud.nextOption();
		this.bike.setColor(this.hud.getItem(), this.hud.getOption());
	}
	*/
	this.gamepadControls.resetPressed();

};
