// This trick allows ColladaLoader to load cross domain textures.
// Sure I'm opening bunch of security holes here, so I just
// close my eyes, smile and go forward.
THREE.ImageLoader.prototype.crossOrigin = "Anonymous";


/**
 * 3D scene.
 */
var BikeBuilder = new Function();


/**
 */
BikeBuilder.prototype.scene = {};
BikeBuilder.prototype.camera = {};
BikeBuilder.prototype.renderer = {};
BikeBuilder.prototype.composer = {};
BikeBuilder.prototype.clock = {};

/* Dimensions */
BikeBuilder.prototype.width = window.innerWidth;
BikeBuilder.prototype.height = window.innerHeight;

/* Frame color options */
BikeBuilder.prototype.colors = {
  frame: {
	objects: ["Frame", "Fork", "RearTriangle"]
  },
  saddle: {
	objects: ["Tape", "Seat"]
  },
  tires: {
	objects: ["FrontWheel", "RearWheel"]
  }
};



/**
 * Init scene and start animation.
 */
BikeBuilder.prototype.init = function init() {

	this.scene = new THREE.Scene();
	this.initCamera();
	this.initRenderer();
	this.initLight();
	this.initFloor();
	this.initShapes();
	this.initClock();
	this.render();

};


/**
 * Init camera.
 */
BikeBuilder.prototype.initCamera = function() {

	//this.camera = new THREE.OrthographicCamera( this.width / - 2, this.width / 2, this.height / 2, this.height / - 2, 1, 10000 );
	//this.camera.position.y = 500;
	//this.camera.position.z = 500;
	//this.camera.position.x = 2000;

	this.camera = new THREE.PerspectiveCamera( 45, this.width / this.height, 1, 2000 );
	this.camera.position.y = 228;
	this.camera.position.z = 496;
	this.camera.position.x = 261;
	this.camera.updateProjectionMatrix();
	this.camera.lookAt(this.scene.position);

	// Add orbital controls.
	this.controls = new THREE.OrbitControls( this.camera, this.renderer.domElement );
	//controls.addEventListener( 'change', render ); // add this only if there is no animation loop (requestAnimationFrame)
	this.controls.enableDamping = true;
	this.controls.dampingFactor = 0.25;
	this.controls.enableZoom = false;
	this.controls.minPolarAngle = 0;
	this.controls.maxPolarAngle = Math.PI * 0.55;
	//  this.controls.minAzimuthAngle = Math.PI;

};


/**
 * Init clock.
 */
BikeBuilder.prototype.initClock = function() {
	this.clock = new THREE.Clock(true);
}

/**
 * Renderer.
 */
BikeBuilder.prototype.initRenderer = function() {

	this.renderer = new THREE.WebGLRenderer({antialias: false});
	this.renderer.setSize( this.width, this.height );

	// Background color.
	this.renderer.setClearColor( 0x000000 , 1 );

	// Enable shadowmaps.
	this.renderer.shadowMapEnabled = true;
	this.renderer.shadowMapType = THREE.PCFSoftShadowMap;

	// Set autoclear to false. We're doing this manually.
	// This is required for shaders to work.
	this.renderer.autoClear = false;
	document.body.appendChild(this.renderer.domElement);

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

};


/**
 * Lights.
 */
BikeBuilder.prototype.initLight = function() {

	var shadowlight = new THREE.DirectionalLight( 0xffffff, 1.8 );
	shadowlight.position.set( 0, 50, 0 );
	shadowlight.castShadow = true;
	shadowlight.shadowDarkness = 0.1;
	//shadowlight.shadowBias = 0.0001;
	shadowlight.shadowMapWidth = 1024; // default is 512
	shadowlight.shadowMapHeight = 1024; // default is 512
	this.scene.add(shadowlight);

	var light = new THREE.DirectionalLight( 0xffffff, 1.2 );
	light.position.set( 60, 100, 20 );
	this.scene.add(light);

	var backLight = new THREE.DirectionalLight( 0xffffff, 0.8 );
	backLight.position.set( -40, 100, 20 );
	this.scene.add(backLight);

};


/**
 * Floor.
 */
BikeBuilder.prototype.initFloor = function() {

	//var geometry = new THREE.PlaneGeometry( 1000, 1000, 1, 1 );

	var geometry = new THREE.CylinderGeometry( 300, 300, 20, 32 );

	var material = new THREE.MeshBasicMaterial( { color: 0xdddddd, side: THREE.FrontSide } );
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

		// Hide preloader.
		$("#js-preloader").hide();
		$(".menu").show();

	});

	// Init photowall.
	this.someWall = new SomeWall();
	this.someWall.init(this.scene);


};



/**
 * Toggle frame materials.
 */
BikeBuilder.prototype.toggleMaterial = function(groupName) {

	var group = this.colors[groupName];

	// Get new color
	group.currentColor = (group.currentColor + 1) % group.colors.length;
	var color = new THREE.Color(group.colors[ group.currentColor ]);

	// Get materials for given objects.
	for (var i in group.objects) {
		this.dae.getObjectByName(group.objects[i]).children[0].material.color = color;
	}

	return group.colors[ group.currentColor ];

}



BikeBuilder.prototype.setMaterial = function(groupName, color) {

	var group = this.colors[groupName];

	// Get new color
	//group.currentColor = (group.currentColor + 1) % group.colors.length;
	var color = new THREE.Color(color);

	// Get materials for given objects.
	for (var i in group.objects) {
		this.dae.getObjectByName(group.objects[i]).children[0].material.color = color;
	}

	//  return group.colors[ group.currentColor ];

}



/**
 * Render method.
 */
BikeBuilder.prototype.render = function() {

	// Autorotate camera.
	//if (typeof(this.dae) != "undefined") {
	//this.dae.rotation.y = this.clock.getElapsedTime() / 4;
	//}

	//console.log(this.camera.position.x + ", " + this.camera.position.y + ", " + this.camera.position.z)

	// Render scene.
	this.controls.update();
	this.renderer.clear();
	this.composer.render();

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
