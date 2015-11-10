/**
 * Round wall displaying some posts.
 */
var SomeWall = new Function();


/* Essential 3D scene objects. */
SomeWall.prototype.scene = {};
SomeWall.prototype.camera = {};
SomeWall.prototype.renderer = {};
SomeWall.prototype.clock = {};

/* Control mode. */
// BikeBuilder.prototype.vrControlsEnabled = false;

/* Gamepad input with keyboard fallback. */
SomeWall.prototype.gamepadControls = {};

/* WebVR controls and effect. */
// BikeBuilder.prototype.vrControls = {};
// BikeBuilder.prototype.vrEffect = {};
// BikeBuilder.prototype.vrEnabled = false;

/* Dimensions */
SomeWall.prototype.width = window.innerWidth;
SomeWall.prototype.height = window.innerHeight;

/* Websocket handler. */
// BikeBuilder.prototype.socket = false;

SomeWall.prototype.photos = [];

SomeWall.prototype.photoUrls = [];

/* Offset from center (y coord) */
SomeWall.prototype.maxRows = 10;
SomeWall.prototype.rowOffset = 0;
SomeWall.prototype.boxSize = 400;
SomeWall.prototype.rowSpacing = 25;

/* Time when photo tween started last time */
SomeWall.prototype.lastAnimateTime = 0;



/**
 * Init scene.
 */
SomeWall.prototype.init = function init(scene, camera, renderer, clock, gamepadControls, loadCallback) {

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

	this.initRenderer();
	this.initLight();
	// this.initFloor();
	this.initShapes();
	this.initLogo();

	loadCallback();

	// this.render();

};



/**
 * Init camera.
 */
SomeWall.prototype.initRenderer = function() {
	this.renderer.setClearColor( 0x000000 , 1 );
}



/**
 * Floor.
 */
SomeWall.prototype.initFloor = function() {

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
 * Floor.
 */
SomeWall.prototype.initLogo = function() {

	var geometry = new THREE.PlaneGeometry( 1000, 1000, 1, 1 );

	// var material = new THREE.MeshBasicMaterial({
	// 	color: 0xff0000,
	// 	side: THREE.FrontSide
	// });

	var texture = THREE.ImageUtils.loadTexture( "img/slush_logo2.jpg" );
	texture.wrapS = THREE.RepeatWrapping;
	texture.wrapT = THREE.RepeatWrapping;
	texture.repeat.set(1, 1);

	var material = new THREE.MeshBasicMaterial({
		map: texture,
		side: THREE.DoubleSide
	});


	var floor = new THREE.Mesh( geometry, material );




	floor.material.side = THREE.DoubleSide;
	floor.position.x = 2000;
	floor.rotation.y = -Math.PI / 2;
	floor.doubleSided = true;
	this.scene.add(floor);


}



/**
 * Lights.
 */
SomeWall.prototype.initLight = function() {

	// Main light.
	var light = new THREE.PointLight(0xffffff, 1.2, 3000, 1)
	light.position.set( 0, 0, 0 );
	this.scene.add(light);

};


SomeWall.prototype.initShapes = function() {

	for (var i = 1; i <= 26; i++) {
		this.photoUrls.push("img/pelago/thumb/" + i + ".jpg");
	}

	this.photos = [];
	this.photosPerRow = 10;
	this.maxRows = 10;
	this.rowSpacing = 600;
	var distance = 1000;
	this.boxSize = 400;
	this.rowOffset = this.maxRows * (this.boxSize + this.rowSpacing) / 2;
	for (var row = 0; row < this.maxRows; row++) {

		for (var i = 0; i < this.photosPerRow; i++) {

			var progress = i / this.photosPerRow;
			var randomDistance = 600 + 1000 * Math.random();

			var geometry = new THREE.PlaneGeometry(this.boxSize, this.boxSize, 1);
			var material = new THREE.MeshPhongMaterial({
				color: 0xffff00 + (progress * 0x0000ff),
				side: THREE.DoubleSide
			});

			var plane = new THREE.Mesh(geometry, material);

			// Start end end positions for tween.

			plane.posFromX = 10 * randomDistance * Math.sin(2 * Math.PI * progress);
			plane.posFromZ = 10 * randomDistance * Math.cos(2 * Math.PI * progress);
			plane.posToX = randomDistance * Math.sin(2 * Math.PI * progress);
			plane.posToZ = randomDistance * Math.cos(2 * Math.PI * progress);

			plane.positionFrom = { x: plane.posFromX, z: plane.posFromZ };
			plane.positionTo = { x: plane.posToX, z: plane.posToZ };

			// plane.position.x = plane.posFromX;
			// plane.position.z = plane.posFromZ;

			// plane.position.x = plane.posToX;
			// plane.position.z = plane.posToZ;
			// plane.position.y = row * (this.boxSize + this.rowSpacing) - this.rowOffset;

			plane.position.y = plane.posFromX;
			plane.position.z = plane.posFromZ;
			plane.position.x = row * (this.boxSize + this.rowSpacing) - this.rowOffset;


			plane.rotation.x = 2 * Math.PI * -progress + Math.PI;
			plane.tweening = true;

			// Hide plane until texture is loaded.
			plane.visible = false;

			this.scene.add(plane);
			this.photos.push(plane);

			// Instantiate a loader.
			var loader = new THREE.TextureLoader();
			loader.crossOrigin = "Anonymous";

			// Randomize url.
			var index = Math.floor(Math.random() * (this.photoUrls.length - 1));
			var url = this.photoUrls[index];

			// Load texture.
			(function(photo, positionFrom, positionTo) {

				loader.load(
					url,
					function(texture) {

						// Set texture.
						var material = new THREE.MeshPhongMaterial({
							map: texture,
							side: THREE.DoubleSide
						});
						photo.material = material;

						// Make visible.
						photo.visible = true;

						// console.log(photo.position);

						// console.log("Photo loaded");

						// Animate in.
						var delay = 1000 + 5000 * Math.random();
						var duration =  4000 + 4000 * Math.random();
						var tween = new TWEEN.Tween(positionFrom).to(positionTo, duration);
						tween.onUpdate(function(){
							photo.position.y = positionFrom.x;
							photo.position.z = positionFrom.z;
						});
						tween.onComplete(function() {
							photo.tweening = false;
						});
						tween.delay(delay);
						tween.easing(TWEEN.Easing.Quartic.Out);
						tween.start();


					},
					function(xhr) {
						console.log('Texture load failed.');
					}
				);

			})(plane, plane.positionFrom, plane.positionTo);

		}

	}

}



/**
 * Animate wall.
 */
SomeWall.prototype.render = function() {

	var delta = this.clock.getDelta();
	var elapsed = this.clock.getElapsedTime();

	var l = this.photos.length;

	// Let photos fall.
	for (var i = 0; i < l; i++) {
		var row = Math.floor(i / this.photosPerRow);
		var photo = this.photos[i];
		var x = (100 * elapsed + row * (this.boxSize + this.rowSpacing)) % (2 * this.rowOffset);
		photo.position.x = this.rowOffset - x;
	}

	// Apply "fly in and out" tween to random elements.
	var delay = elapsed - this.lastAnimateTime;
	if (delay > 5) {
		for (var i = 0; i < 40; i++) {
			var rand = Math.round((this.photos.length - 1) * Math.random());
			this.applyTween(this.photos[rand]);

		}
		this.lastAnimateTime = elapsed;
	}

}



/**
 * Apply pumping tweet.
 *
 * Fucka mess.
 */
SomeWall.prototype.applyTween = function(photo) {

	if (photo.tweening) {
		return false;
	}

	photo.tweening = true;

	var delay = 2000 * Math.random();
	var duration = 4000 + 4000 * Math.random();

	var positionFrom = { x: photo.posFromX, z: photo.posFromZ };
	var positionTo = { x: photo.posToX, z: photo.posToZ };

	// First tween out.
	var tween = new TWEEN.Tween(positionTo)
		.to(positionFrom, duration)
		.onUpdate(function(){
			photo.position.y = positionTo.x;
			photo.position.z = positionTo.z;
		})
		.onComplete(function() {

			// Tween back in.
			var positionFrom = { x: photo.posFromX, z: photo.posFromZ };
			var positionTo = { x: photo.posToX, z: photo.posToZ };

			var tween = new TWEEN.Tween(positionFrom)
				.to(positionTo, duration)
				.onUpdate(function(){
					photo.position.y = positionFrom.x;
					photo.position.z = positionFrom.z;
				})
				.onComplete(function() {
					photo.tweening = false;
				})
				.delay(delay)
				.easing(TWEEN.Easing.Quartic.Out)
				.start();


		})
		.delay(delay)
		.easing(TWEEN.Easing.Quartic.In)
		.start();


}
