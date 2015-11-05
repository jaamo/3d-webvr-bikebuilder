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
BikeBuilder.prototype.composer = {};
BikeBuilder.prototype.clock = {};

/* Control mode. */
BikeBuilder.prototype.vrControlsEnabled = false;

/* Gamepad input with keyboard fallback. */
BikeBuilder.prototype.gamepadControls = {};

/* WebVR controls and effect. */
BikeBuilder.prototype.vrControls = {};
BikeBuilder.prototype.vrEffect = {};
BikeBuilder.prototype.vrEnabled = false;

/* Dimensions */
BikeBuilder.prototype.width = window.innerWidth;
BikeBuilder.prototype.height = window.innerHeight;

/* Websocket handler. */
BikeBuilder.prototype.socket = false;



/**
 * Init scene.
 */
BikeBuilder.prototype.init = function init() {

	// Oculus or not.
	if ($.urlParam("vr") == "true") {
		this.vrControlsEnabled = true;
	}

	this.scene = new THREE.Scene();
	this.initRenderer();
    this.initCamera();
    this.initVR();
	this.initLight();
	this.initFloor();
	this.initShapes(); // <- triggers render loop when load complete
	this.initClock();
	this.initControls();
	this.initSocket();

	this.render();

};



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
BikeBuilder.prototype.initClock = function() {
	this.clock = new THREE.Clock(true);
}



/**
 * Init renderer and shaders.
 */
BikeBuilder.prototype.initRenderer = function() {

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

    return;

    // Skip shaders for now.

	// Create effect composer to mix shaders.
	this.composer = new THREE.EffectComposer( this.renderer );

	// First render the scene.
	this.composer.addPass(new THREE.RenderPass( this.scene, this.camera ));

	// Init FXAA antialias shader.
	var effectFXAA = new THREE.ShaderPass( THREE.FXAAShader );
	effectFXAA.uniforms[ 'resolution' ].value.set( 1 / this.width, 1 / this.height );
	this.composer.addPass( effectFXAA );

	// Bloom
	this.composer.addPass( new THREE.BloomPass( 0.4 ) );

	// Copy pass.
	var effectCopy = new THREE.ShaderPass( THREE.CopyShader );
	effectCopy.renderToScreen = true; // Last pass needs to render to screen
	this.composer.addPass( effectCopy );

    // Handle window resize.
    window.addEventListener('resize', function() {
        self.onWindowResize();
    }, false);


};



/**
 * Init webvr.
 */
BikeBuilder.prototype.initVR = function() {


	if (this.vrControlsEnabled) {

		// Init VR controls.
		this.vrControls = new THREE.VRControls(this.camera);

		// Init VR effect.
		this.vrEffect = new THREE.VREffect(this.renderer);
		this.vrEffect.setSize(this.width, this.height);

	}


}



/**
 * Lights.
 */
BikeBuilder.prototype.initLight = function() {

    // Shadow.
	var shadowlight = new THREE.DirectionalLight( 0xffffff, 1.8 );
	shadowlight.position.set( 0, 50, 0 );
	shadowlight.castShadow = true;
	shadowlight.shadowDarkness = 0.1;
	shadowlight.shadowMapWidth = 1024; // default is 512
	shadowlight.shadowMapHeight = 1024; // default is 512
	this.scene.add(shadowlight);

	// Main light.
	var light = new THREE.PointLight(0xffffff, 1.2, 3000, 1)
	light.position.set( 0, 400, 0 );
	this.scene.add(light);

	var light2 = new THREE.PointLight(0xffffff, 1.2, 500, 1)
	light2.position.set( 0, 100, 200 );
	this.scene.add(light2);

	var light3 = new THREE.PointLight(0xffffff, 1.2, 500, 1)
	light3.position.set( 0, 100, -200 );
	this.scene.add(light3);

};



/**
 * Floor.
 */
BikeBuilder.prototype.initFloor = function() {

	//var geometry = new THREE.PlaneGeometry( 1000, 1000, 1, 1 );

	var geometry = new THREE.CylinderGeometry( 300, 300, 20, 32 );

	var material = new THREE.MeshBasicMaterial( { color: 0x202020, side: THREE.FrontSide } );
	var floor = new THREE.Mesh( geometry, material );

	floor.material.side = THREE.DoubleSide;
	floor.position.y = -210;
	//floor.rotation.x = 90*Math.PI/180;
	floor.rotation.y = 0;
	floor.rotation.z = 0;
	floor.doubleSided = true;
	floor.receiveShadow = true;
	this.scene.add(floor);

};



/**
 * Shapes.
 */
BikeBuilder.prototype.initShapes = function() {

	var self = this;

	// Initialize bike.
	this.bike = new Bike()
	this.bike.init(this.scene, function() {

		console.log("Reset colors");
		for (var i in self.hud.items) {
			self.bike.setColor(self.hud.items[i].key, self.hud.items[i].options[0].key);
		}

		// Init photowall.
		self.someWall = new SomeWall();
		self.someWall.init(self.scene);

		self.render();

	});
	// self.someWall = new SomeWall();
	// self.someWall.init(self.scene);

	// Hub.
	this.hud = new HUD();
	this.hud.init(this.scene, this.camera);

	this.lensFlare = new LensFlare();
	this.lensFlare.init(this.scene);

};



/**
 * Init controls.
 */
BikeBuilder.prototype.initControls = function() {

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
BikeBuilder.prototype.initSocket = function() {

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
BikeBuilder.prototype.enterVR = function() {
	console.log("Enter VR");
	this.vrEffect.setFullScreen(true);
	this.vrEnabled = true;
}



/**
 * Exit VR mode.
 */
BikeBuilder.prototype.exitVR = function() {
  console.log("Exit VR.");
  this.vrEffect.setFullScreen(false);
  this.vrEnabled = false;
};




/**
 * Toggle VR on and off.
 */
BikeBuilder.prototype.toggleVR = function() {
	if (!this.vrEnabled) {
		this.enterVR();
	} else {
		this.exitVR();
	}
}



/**
 * Handle window resize.
 */
BikeBuilder.prototype.onWindowResize = function() {
    console.log("Resize window.");
    this.camera.aspect = window.innerWidth / window.innerHeight;
    this.camera.updateProjectionMatrix();
    this.vrEffect.setSize(window.innerWidth, window.innerHeight);
}



/**
 * Render method.
 */
BikeBuilder.prototype.render = function() {

	var delta = this.clock.getDelta();
	var elapsed = this.clock.getElapsedTime();

	// Socket pre render routines.
	this.socket.handleRender(this);

	// Handle bike rotation.
	if (this.gamepadControls.active("axis1left") > 0) {
		this.bike.obj.rotation.y += (Math.PI / 2) * delta * this.gamepadControls.active("axis1left");
	}
	if (this.gamepadControls.active("axis1right") > 0) {
		this.bike.obj.rotation.y -= (Math.PI / 2) * delta * this.gamepadControls.active("axis1right");
	}

	if (this.gamepadControls.active("axis3up") > 0) { this.hud.keyUp = true; } else { this.hud.keyUp = false; }
	if (this.gamepadControls.active("axis3down") > 0) { this.hud.keyDown = true; } else { this.hud.keyDown = false; }
	if (this.gamepadControls.active("axis3left") > 0) { this.hud.keyLeft = true; } else { this.hud.keyLeft = false; }
	if (this.gamepadControls.active("axis3right") > 0) { this.hud.keyRight = true; } else { this.hud.keyRight = false; }


	// Handle menu events.
	this.gamepadControls.initPressed();
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
	this.gamepadControls.resetPressed();

	// Run tweens.
	TWEEN.update();

	// Animate wall.
	this.someWall.animate(delta, elapsed);

	if (this.vrControlsEnabled) {

		// Render scene.
		//this.controls.update();
		this.vrControls.update();
		//this.camera.rotation.y += 1;
		//this.renderer.clear();
	    //this.camera.updateProjectionMatrix();
	    //console.log(this.camera.rotation.y);
		//this.composer.render();

	    this.camera.position.y = 228/2;
		this.camera.position.z = 496/2;
		this.camera.position.x = 261/2;
		this.camera.updateMatrixWorld();

	    //this.camera.updateProjectionMatrix();
		this.renderer.clear();
		this.vrEffect.render(this.scene, this.camera);
		this.hud.render(this.renderer, delta, true);



	} else {

		// Render scene.

		// This is a little bit of a hack, but disable these
		// controls when in socket slave mode.
		if (this.socket.mode != "slave") {
			this.controls.update();
		}
		this.camera.updateMatrixWorld();
		this.camera.updateProjectionMatrix();

		//this.hud.animate(this.scene, this.camera);

		this.renderer.clear();
		this.renderer.render(this.scene, this.camera);
		this.hud.render(this.renderer, delta, false);
		// this.renderer.render(this.hud.scene, this.hud.camera);


	}

	// Socket post render routines.
	// this.socket.postRender(this);

	// Request new frame.
	requestAnimationFrame(this.render.bind(this));

};





/**
 * Run da shit when DOM is ready.
 */
document.addEventListener("DOMContentLoaded", function() {

  // Just to make console cleaner.
  console.log("Init");

  // Init scene.
  var bikeBuilder = new BikeBuilder();
  bikeBuilder.init();

});
