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

	this.image = new Image();
	this.image.onload = function() {
		var newWidth = self.image.width / 2;
		var newHeight = self.image.height / 2;
		var padding = 20;
		self.hudBitmap.globalAlpha = 0.7;
		self.hudBitmap.drawImage(self.image, 0, 0, self.image.width, self.image.height, self.width - newWidth - padding, padding, newWidth, newHeight);
		self.hudBitmap.globalAlpha = 1;
	};
	this.image.src = "img/pelago_logo.png";

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
	return this.items[this.selectedItem].options[ this.items[this.selectedItem].selected ].key;
}


HUD.prototype.render = function(renderer, delta) {

  var self = this;

  this.hudBitmap.clearRect(0, this.height / 2, this.width, this.height / 2);

/*
  var y = this.height - 100;
  var ySpacing = 40;
  var yOffset = - this.selectedItem * ySpacing;
  var xSpacing = 2;

  // Item has changed.
  if (this.currentItem != this.selectedItem) {

	// Reset progress on the first iteration.
	if (!this.tweenRunning) {
	  this.tweenRunning = true;
	  this.tweenProgress = 0;
	}

	// Calculate progress.
	this.tweenProgress += delta * 5;

	// Calculate position.
	if (this.currentItem < this.selectedItem) {
	  yOffset = (-this.currentItem - this.tweenProgress) * ySpacing;
	} else {
	  yOffset = (-this.currentItem + this.tweenProgress) * ySpacing;
	}

	// Adjust opacity.
	for (var i = 0; i < this.items.length; i++) {
	  if (i == this.selectedItem) {
		this.items[i].opacity = this.tweenProgress;
	  } else if (i == this.currentItem) {
		this.items[i].opacity = 1 - this.tweenProgress;
	  }
	};

	// Handle tween end.
	if (this.tweenProgress >= 1) {
	  this.tweenRunning = false;
	  this.currentItem = this.selectedItem;
	  this.tweenProgress = 1;

	  // Place item.
	  yOffset = -this.currentItem * ySpacing;

	}

  }


  var i = 0;
  for (var key in this.items) {

	this.hudBitmap.font = "Bold 20px Futura";
	this.hudBitmap.textAlign = 'right';
	this.hudBitmap.fillStyle = "rgba(245,245,245,"+this.items[key].opacity+")";

	this.hudBitmap.fillText(
	  this.items[key].label + ":",
	  this.width / 2 - xSpacing,
	  y + yOffset + i * ySpacing
	);

	i++;

}*/

  this.hudTexture.needsUpdate = true;




  this.hudBitmap.font = "Bold 40px Futura";
  this.hudBitmap.textAlign = 'right';
  this.hudBitmap.fillStyle = "rgba(245,245,245,0.95)";
  this.hudBitmap.fillText(this.items[this.selectedItem].label + ": ", this.width / 2, this.height - 80);

  this.hudBitmap.font = "Normal 40px Futura";
  this.hudBitmap.textAlign = 'left';
  this.hudBitmap.fillStyle = "rgba(245,245,245,0.6)";
  this.hudBitmap.fillText(this.items[this.selectedItem].options[ this.items[this.selectedItem].selected ].label, this.width / 2, this.height - 80);


  renderer.render(this.scene, this.camera);

}
