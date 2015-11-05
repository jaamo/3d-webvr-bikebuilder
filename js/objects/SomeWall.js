/**
 * Round wall displaying some posts.
 */
var SomeWall = new Function();

SomeWall.prototype.photos = [];

SomeWall.prototype.photoUrls = [];

/* Offset from center (y coord) */
SomeWall.prototype.maxRows = 10;
SomeWall.prototype.rowOffset = 0;
SomeWall.prototype.boxSize = 400;
SomeWall.prototype.rowSpacing = 25;

/* Time when photo tween started last time */
SomeWall.prototype.lastAnimateTime = 0;




SomeWall.prototype.init = function(scene, successCallback) {

	for (var i = 1; i <= 26; i++) {
		this.photoUrls.push("img/pelago/thumb/" + i + ".jpg");
	}

	this.photos = [];
	this.photosPerRow = 15;
	this.maxRows = 10;
	this.rowSpacing = 25;
	var distance = 1000;
	this.boxSize = 400;
	this.rowOffset = this.maxRows * (this.boxSize + this.rowSpacing) / 2;
	for (var row = 0; row < this.maxRows; row++) {

		for (var i = 0; i < this.photosPerRow; i++) {

			var progress = i / this.photosPerRow;
			var randomDistance = 1000 + 2000 * Math.random();

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

			plane.position.x = plane.posFromX;
			plane.position.z = plane.posFromY;
			plane.position.y = row * (this.boxSize + this.rowSpacing) - this.rowOffset;
			plane.rotation.y = 2 * Math.PI * progress + Math.PI;
			plane.tweening = true;

			// Hide plane until texture is loaded.
			plane.visible = false;

			scene.add(plane);
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

						// Animate in.
						var delay = 1000 + 5000 * Math.random();
						var duration =  4000 + 4000 * Math.random();
						var tween = new TWEEN.Tween(positionFrom).to(positionTo, duration);
						tween.onUpdate(function(){
							photo.position.x = positionFrom.x;
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
SomeWall.prototype.animate = function(delta, elapsed) {

	var l = this.photos.length;

	// Let photos fall.
	for (var i = 0; i < l; i++) {
		var row = Math.floor(i / this.photosPerRow);
		var photo = this.photos[i];
		var y = (100 * elapsed + row * (this.boxSize + this.rowSpacing)) % (2 * this.rowOffset);
		photo.position.y = this.rowOffset - y;
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
			photo.position.x = positionTo.x;
			photo.position.z = positionTo.z;
		})
		.onComplete(function() {

			// Tween back in.
			var positionFrom = { x: photo.posFromX, z: photo.posFromZ };
			var positionTo = { x: photo.posToX, z: photo.posToZ };

			var tween = new TWEEN.Tween(positionFrom)
				.to(positionTo, duration)
				.onUpdate(function(){
					photo.position.x = positionFrom.x;
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
