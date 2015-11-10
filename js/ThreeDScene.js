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

/* Active scene. */
ThreeDScene.prototype.activeScene = 0;
ThreeDScene.prototype.allScenes = [];

/* Enable rendering. */
ThreeDScene.prototype.enableRender = true;




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
	this.initClock();
	this.initControls();
	this.initSocket();
    this.initCamera();
	this.initVR();

	// Init scenes.
	this.bikeBuilder = new BikeBuilder();
	this.someWall = new SomeWall();

	// Add scenes to list.
	this.allScenes.push(this.someWall);
	this.allScenes.push(this.bikeBuilder);

	// Init the first.
	this.allScenes[this.activeScene].init(this.scene, this.camera, this.renderer, this.clock, this.gamepadControls, this.render.bind(this));

	// Handle keypress.
	$(document).keypress(function(e){
		if (e.keyCode == 13) {
			this.toggleScenes();
		}
	}.bind(this));

};



/**
 * Toggle between scenes.
 */
ThreeDScene.prototype.toggleScenes = function() {

	// Stop render loop.
	this.enableRender = false;

	// Wait for last render to be ready.
	setTimeout(function() {

		// Clear everything.
		this.clearScene();

		// Set new active scene.
		this.activeScene = (this.activeScene + 1) % this.allScenes.length;

		// Init new scene and start rendering.
		this.enableRender = true;
		this.allScenes[this.activeScene].init(this.scene, this.camera, this.renderer, this.clock, this.gamepadControls, this.render.bind(this));

	}.bind(this), 500);

}



ThreeDScene.prototype.render = function() {

	this.allScenes[this.activeScene].render();

	TWEEN.update();

	// Animate wall.

	if (this.vrControlsEnabled) {

		// Render scene.
		this.vrControls.update();

	    // this.camera.position.y = 228/2;
		// this.camera.position.z = 496/2;
		// this.camera.position.x = 261/2;
		this.camera.updateMatrixWorld();

		this.renderer.clear();
		this.vrEffect.render(this.scene, this.camera);
		// this.hud.render(this.renderer, delta, true);



	} else {

		// Render scene.

		// This is a little bit of a hack, but disable these
		// controls when in socket slave mode.
		// if (this.socket.mode != "slave") {
		// 	this.controls.update();
		// }
		this.camera.updateMatrixWorld();
		this.camera.updateProjectionMatrix();

		//this.hud.animate(this.scene, this.camera);

		this.renderer.clear();
		this.renderer.render(this.scene, this.camera);
		// this.hud.render(this.renderer, delta, false);


	}


	// Request new frame.
	if (this.enableRender) {
		requestAnimationFrame(this.render.bind(this));
	}

}



ThreeDScene.prototype.clearScene = function() {
	for(var i = this.scene.children.length - 1; i >= 0; i--) {
		obj = this.scene.children[i];
		this.scene.remove(obj);
	}
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
		this.vrControls.scale = 2000;

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
