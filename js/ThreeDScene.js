// This trick allows ColladaLoader to load cross domain textures.
// Sure I'm opening bunch of security holes here, so I just
// close my eyes, smile and go forward.
THREE.ImageLoader.prototype.crossOrigin = "Anonymous";


/**
 * 3D scene.
 */
var ThreeDScene = new Function();



/* Essential 3D scene objects. */
ThreeDScene.prototype.scene = {};
ThreeDScene.prototype.camera = {};
ThreeDScene.prototype.renderer = {};
ThreeDScene.prototype.clock = {};

/* Control mode. */
ThreeDScene.prototype.vrControlsEnabled = false;

/* Gamepad input with keyboard fallback. */
ThreeDScene.prototype.gamepadControls = {};

/* WebVR controls and effect. */
ThreeDScene.prototype.vrControls = {};
ThreeDScene.prototype.vrEffect = {};
ThreeDScene.prototype.vrEnabled = false;

/* Dimensions */
ThreeDScene.prototype.width = window.innerWidth;
ThreeDScene.prototype.height = window.innerHeight;

/* Websocket handler. */
ThreeDScene.prototype.socket = false;



/**
 * Init scene.
 */
ThreeDScene.prototype.init = function init() {

	var self = this;

	// Oculus or not.
	if ($.urlParam("vr") == "true") {
		this.vrControlsEnabled = true;
	}

	this.scene = new THREE.Scene();

	this.initRenderer();
	this.initVR();
	this.initClock();
	this.initControls();
	this.initSocket();
    this.initCamera();

	this.bikeBuilder = new BikeBuilder();
	this.bikeBuilder.init(this.scene, this.camera, this.renderer, this.clock, this.gamepadControls, this.renderBike.bind(this));

	// this.initLight();
	// this.initFloor();
	// this.initShapes(); // <- triggers render loop when load complete


};



ThreeDScene.prototype.renderBike = function() {

	this.bikeBuilder.render();

	// Request new frame.
	requestAnimationFrame(this.renderBike.bind(this));

}



/**
 * Init camera.
 */
ThreeDScene.prototype.initCamera = function() {

	this.camera = new THREE.PerspectiveCamera( 75, this.width / this.height, 0.3, 10000 );
	this.camera.position.y = 228;
	this.camera.position.z = 496;
	this.camera.position.x = 261;

	// Add orbital controls.
	if (!this.vrControlsEnabled) {

		this.controls = new THREE.OrbitControls( this.camera, this.renderer.domElement );
		//controls.addEventListener( 'change', render ); // add this only if there is no animation loop (requestAnimationFrame)
		this.controls.enableDamping = true;
		this.controls.dampingFactor = 0.25;
		this.controls.enableZoom = false;
		this.controls.minPolarAngle = 0;
		this.controls.maxPolarAngle = Math.PI * 0.55;
		//  this.controls.minAzimuthAngle = Math.PI;

	}

};


/**
 * Init clock.
 */
ThreeDScene.prototype.initClock = function() {
	this.clock = new THREE.Clock(true);
}



/**
 * Init renderer and shaders.
 */
ThreeDScene.prototype.initRenderer = function() {

    var self = this;

	this.renderer = new THREE.WebGLRenderer({antialias: true, alpha: true});

	this.renderer.autoClear = false;

	if (!this.vrControlsEnabled) {
		this.renderer.setSize( this.width, this.height );
	}

    this.renderer.setPixelRatio(window.devicePixelRatio);

	// Background color.
	this.renderer.setClearColor( 0x000000 , 1 );

	// Enable shadowmaps.
	this.renderer.shadowMapEnabled = true;
	this.renderer.shadowMapType = THREE.PCFSoftShadowMap;

	// Set autoclear to false. We're doing this manually.
	// This is required for shaders to work.
	// this.renderer.autoClear = false;
	document.body.appendChild(this.renderer.domElement);

};



/**
 * Init webvr.
 */
ThreeDScene.prototype.initVR = function() {


	if (this.vrControlsEnabled) {

		// Init VR controls.
		this.vrControls = new THREE.VRControls(this.camera);

		// Init VR effect.
		this.vrEffect = new THREE.VREffect(this.renderer);
		this.vrEffect.setSize(this.width, this.height);

	}


}



/**
 * Init controls.
 */
ThreeDScene.prototype.initControls = function() {

	var self = this;

	// Toggle VR if f-button is pressed.
	window.addEventListener('keydown', function(event) {
		if (event.keyCode == 70) { // f
			self.toggleVR();
		}
	}, true);

	this.gamepadControls = new GamepadControls();
	this.gamepadControls.init();

}



/**
 * Init websocket connection.
 */
ThreeDScene.prototype.initSocket = function() {

	this.socket = new Socket();

	if ($.urlParam("socket") == "master") {

		this.socket.mode = "master";
		this.socket.openConnection();

	}

	if ($.urlParam("socket") == "slave") {

		this.socket.mode = "slave";
		this.socket.openConnection();

	}

}



/**
 * Enter virtual reality mode.
 */
ThreeDScene.prototype.enterVR = function() {
	console.log("Enter VR");
	this.vrEffect.setFullScreen(true);
	this.vrEnabled = true;
}



/**
 * Exit VR mode.
 */
ThreeDScene.prototype.exitVR = function() {
  console.log("Exit VR.");
  this.vrEffect.setFullScreen(false);
  this.vrEnabled = false;
};




/**
 * Toggle VR on and off.
 */
ThreeDScene.prototype.toggleVR = function() {
	if (!this.vrEnabled) {
		this.enterVR();
	} else {
		this.exitVR();
	}
}



/**
 * Handle window resize.
 */
ThreeDScene.prototype.onWindowResize = function() {
    console.log("Resize window.");
    this.camera.aspect = window.innerWidth / window.innerHeight;
    this.camera.updateProjectionMatrix();
    this.vrEffect.setSize(window.innerWidth, window.innerHeight);
}



/**
 * Run da shit when DOM is ready.
 */
document.addEventListener("DOMContentLoaded", function() {

  // Just to make console cleaner.
  console.log("Init");

  // Init scene.
  var threeDScene = new ThreeDScene();
  threeDScene.init();

});
