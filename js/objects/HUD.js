/**
 * Bike.
 */
var HUD = new Function();

HUD.prototype.camera = {};
HUD.prototype.scene = {};
HUD.prototype.hudBitmap = {};
HUD.prototype.hudTexture = {};

HUD.prototype.width = window.innerWidth;
HUD.prototype.height = window.innerHeight;

HUD.prototype.tweenRunning = false;
HUD.prototype.tweenProgress = 0;

HUD.prototype.selectedItem = 0;
HUD.prototype.currentItem = 0;

// Active keys.
HUD.prototype.keyUp = false;
HUD.prototype.keyDown = false;
HUD.prototype.keyLeft = false;
HUD.prototype.keyRight = false;


HUD.prototype.items = [
  {
	"label": "Frame",
	"key": "frame",
	"selected": 0,
	"opacity": 1,
	"options": [
		{ key: 0xe24814, "label": "Red" },
	  { key: 0x545454, "label": "Grey" },
	  { key: 0x1c1c1c, "label": "Black" },
	  { key: 0xeaeaea, "label": "White" },
	  { key: 0x3b79d6, "label": "Blue" },
	  { key: 0xffe62b, "label": "Yellow" },
	  { key: 0xffb55b, "label": "Orange" }
	]
  },
  {
	"label": "Saddle",
	"key": "saddle",
	"selected": 0,
	"opacity": 0,
	"options": [
	  { key: 0x545454, "label": "Grey" },
	  { key: 0x1c1c1c, "label": "Black" },
  	  { key: 0xeaeaea, "label": "White" },
  	  { key: 0xe24814, "label": "Red" },
  	  { key: 0x3b79d6, "label": "Blue" },
  	  { key: 0xffe62b, "label": "Yellow" },
  	  { key: 0xffb55b, "label": "Orange" }
	]
  },
  {
	"label": "Tires",
	"key": "tires",
	"selected": 0,
	"opacity": 0,
	"options": [
	  { key: 0x545454, "label": "Grey" },
	  { key: 0x1c1c1c, "label": "Black" },
  	  { key: 0xeaeaea, "label": "White" },
  	  { key: 0xe24814, "label": "Red" },
  	  { key: 0x3b79d6, "label": "Blue" },
  	  { key: 0xffe62b, "label": "Yellow" },
  	  { key: 0xffb55b, "label": "Orange" }
	]
  }
];

HUD.prototype.init = function(scene, camera) {

	var self = this;

	// Create otrhographic camera for HUD.
	this.camera = new THREE.OrthographicCamera(-this.width/2, this.width/2, this.height/2, -this.height/2, 0, 30 );

	// Create also a custom scene for HUD.
	this.scene = new THREE.Scene();

	// We will use 2D canvas element to render our HUD.
	var hudCanvas = document.createElement('canvas');

	// Set dimensions to fit the screen.
	hudCanvas.width = this.width;
	hudCanvas.height = this.height;

	// Get 2D context and draw something.
	this.hudBitmap = hudCanvas.getContext('2d');

	// Create texture from rendered graphics.
	this.hudTexture = new THREE.Texture(hudCanvas)
	this.hudTexture.needsUpdate = true;
	this.hudTexture.minFilter = THREE.NearestFilter;

	// Create HUD material.
	var material = new THREE.MeshBasicMaterial( {map: this.hudTexture } );
	material.transparent = true;

	// var material = new THREE.MeshBasicMaterial( {color: 0x00ff00 } );

	// Create plane to render the HUD. This plane fill the whole
	// screen.
	var planeGeometry = new THREE.PlaneGeometry( this.width, this.height );
	var plane = new THREE.Mesh( planeGeometry, material );
	this.scene.add( plane );

    // this.hudBitmap.font = "Normal 20px Helvetica";
	// this.hudBitmap.textAlign = 'left';
	// this.hudBitmap.fillStyle = "rgba(245,245,245,0.6)";
	// this.hudBitmap.fillText("WebVR demo running on Firefox. No plugins. Just magic.", 20, 40);



	// this.image = new Image();
	// this.image.onload = function() {
	// 	var newWidth = self.image.width / 1;
	// 	var newHeight = self.image.height / 1;
	// 	var padding = 20;
	// 	self.hudBitmap.globalAlpha = 0.7;
	// 	self.hudBitmap.drawImage(self.image, 0, 0, self.image.width, self.image.height, self.width - newWidth - padding, padding, newWidth, newHeight);
	// 	self.hudBitmap.globalAlpha = 1;
	// };
	// this.image.src = "img/pelago_logo.png";

}



HUD.prototype.nextItem = function() {
	if (typeof(this.items[this.selectedItem + 1]) != "undefined") {
		this.selectedItem++;
	}
}

HUD.prototype.previousItem = function() {
	if (typeof(this.items[this.selectedItem - 1]) != "undefined") {
		this.selectedItem--;
	}
}

HUD.prototype.previousOption = function() {
	var i = this.items[this.selectedItem];
	if (typeof(i.options[ i.selected - 1 ]) != "undefined") {
		i.selected--;
	}
}

HUD.prototype.nextOption = function() {
	var i = this.items[this.selectedItem];
	if (typeof(i.options[ i.selected + 1 ]) != "undefined") {
		i.selected++;
	}
}

HUD.prototype.getItem = function() {
	return this.items[this.selectedItem].key;
}

HUD.prototype.getOption = function() {
	return this.items[this.selectedItem].selected [ this.items[this.selectedItem].selected ].key;
}

HUD.prototype.getItemLabel = function(itemId) {
	return this.items[itemId].key;
}

HUD.prototype.getItemOptionKey = function(itemId) {
	return this.items[itemId].options[ this.items[itemId].selected ].key;
}

/**
 * Toggle options within a group.
 * @param  {String} item
 */
HUD.prototype.toggleOption = function(itemId) {

	var nextOption = (this.items[itemId].selected + 1) % this.items[itemId].options.length;
	this.items[itemId].selected = nextOption;


}



HUD.prototype.render = function(renderer, delta, vr) {

	var self = this;

	// Clear bottom of the screen (keep logo);
	this.hudBitmap.clearRect(0, this.height / 2, this.width, this.height / 2);

	// Require update for this texture.
	this.hudTexture.needsUpdate = true;

	// Render category.
	this.hudBitmap.font = "Bold 40px Bitter";
	this.hudBitmap.textAlign = 'right';
	this.hudBitmap.fillStyle = "rgba(245,245,245,0.95)";
	this.hudBitmap.fillText(this.items[this.selectedItem].label + ": ", this.width / 2, this.height - 80);

	// Render color.
	this.hudBitmap.font = "Normal 40px Bitter";
	this.hudBitmap.textAlign = 'left';
	this.hudBitmap.fillStyle = "rgba(245,245,245,0.6)";
	this.hudBitmap.fillText(this.items[this.selectedItem].options[ this.items[this.selectedItem].selected ].label, this.width / 2, this.height - 80);

	this.drawTriangle(this.width * 0.37, this.height - 90, "left", this.keyLeft);
	this.drawTriangle(this.width * 0.62, this.height - 90, "right", this.keyRight);
	this.drawTriangle(this.width * 0.5, this.height - 130, "up", this.keyUp);
	this.drawTriangle(this.width * 0.5, this.height - 55, "down", this.keyDown);

	// If vr is enabled, render hud for both eyes.
	if (vr) {

		var size = renderer.getSize();
		size.width /= 2;

		renderer.setViewport( 0, 0, size.width, size.height );
		renderer.setScissor( 0, 0, size.width, size.height );
		renderer.render( this.scene, this.camera );

		renderer.setViewport( size.width, 0, size.width, size.height );
		renderer.setScissor( size.width, 0, size.width, size.height );
		renderer.render( this.scene, this.camera );

	} else {

		renderer.render(this.scene, this.camera);

	}

}

HUD.prototype.drawTriangle = function(x, y, direction, active) {

	var size = 15;

	if (active) {
		this.hudBitmap.fillStyle = "rgba(245,245,245,0.8)";
	} else {
		this.hudBitmap.fillStyle = "rgba(245,245,245,0.1)";
	}

	this.hudBitmap.beginPath();
	if (direction == "left") {
		this.hudBitmap.moveTo(x, y);
		this.hudBitmap.lineTo(x + size, y + size);
		this.hudBitmap.lineTo(x + size, y - size);
	}
	if (direction == "right") {
		this.hudBitmap.moveTo(x + size, y);
		this.hudBitmap.lineTo(x, y + size);
		this.hudBitmap.lineTo(x, y - size);
	}
	if (direction == "up") {
		this.hudBitmap.moveTo(x, y - size);
		this.hudBitmap.lineTo(x + size, y);
		this.hudBitmap.lineTo(x - size, y);
	}
	if (direction == "down") {
		this.hudBitmap.moveTo(x, y + size);
		this.hudBitmap.lineTo(x + size, y);
		this.hudBitmap.lineTo(x - size, y);
	}
	this.hudBitmap.fill();


}
