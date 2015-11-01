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
    "selected": 0,
    "opacity": 1,
    "options": [
      { key: "0xff0000", "label": "Red" },
      { key: "0x0000ff", "label": "Blue" },
      { key: "0x00ff00", "label": "Green" }
    ]
  },
  {
    "label": "Saddle",
    "selected": 0,
    "opacity": 0,
    "options": [
      { key: "0xff0000", "label": "Red" },
      { key: "0x0000ff", "label": "Blue" },
      { key: "0x00ff00", "label": "Green" }
    ]
  },
  {
    "label": "Tires",
    "selected": 0,
    "opacity": 0,
    "options": [
      { key: "0xff0000", "label": "Red" },
      { key: "0x0000ff", "label": "Blue" },
      { key: "0x00ff00", "label": "Green" }
    ]
  },
  {
    "label": "Banana",
    "selected": 0,
    "opacity": 0,
    "options": [
      { key: "0xff0000", "label": "Red" },
      { key: "0x0000ff", "label": "Blue" },
      { key: "0x00ff00", "label": "Green" }
    ]
  },
  {
    "label": "Chicken",
    "selected": 0,
    "opacity": 0,
    "options": [
      { key: "0xff0000", "label": "Red" },
      { key: "0x0000ff", "label": "Blue" },
      { key: "0x00ff00", "label": "Green" }
    ]
  },
];



HUD.prototype.init = function(scene, camera) {

	// Ok, now we have the cube. Next we'll create the hud. For that we'll
    // need a separate scene which we'll render on top of our 3D scene. We'll
    // use a dynamic texture to render the HUD.

	// Create shortcuts for window size.
    var width = window.innerWidth;
    var height = window.innerHeight;

    // We will use 2D canvas element to render our HUD.
  	var hudCanvas = document.createElement('canvas');

    // Again, set dimensions to fit the screen.
    hudCanvas.width = width;
    hudCanvas.height = height;

    // Get 2D context and draw something supercool.
    this.hudBitmap = hudCanvas.getContext('2d');
  	this.hudBitmap.font = "Normal 40px Arial";
    this.hudBitmap.textAlign = 'center';
    this.hudBitmap.fillStyle = "rgba(245,245,245,0.75)";
    this.hudBitmap.fillText('Initializing...', width / 2, height / 2);

    // Create the camera and set the viewport to match the screen dimensions.
    this.camera = new THREE.OrthographicCamera(-width/2, width/2, height/2, -height/2, 0, 30 );

    // Create also a custom scene for HUD.
    this.scene = new THREE.Scene();

  	// Create texture from rendered graphics.
  	var hudTexture = new THREE.Texture(hudCanvas)
  	hudTexture.needsUpdate = true;

    // Create HUD material.
    var material = new THREE.MeshBasicMaterial( {map: hudTexture} );
    material.transparent = true;

    // Create plane to render the HUD. This plane fill the whole screen.
    var planeGeometry = new THREE.PlaneGeometry( width, height );
    var plane = new THREE.Mesh( planeGeometry, material );
	plane.z = 10;

    this.scene.add( plane );

}




HUD.prototype.render = function(renderer, delta) {

  this.hudBitmap.clearRect(0, 0, this.width, this.height);

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

     /*
    this.hudBitmap.font = "Normal 20px Futura";
    this.hudBitmap.textAlign = 'left';
    this.hudBitmap.fillStyle = "rgba(245,245,245,0.7)";

    this.hudBitmap.fillText(this.items[key].options[0].label, this.width / 2 + xSpacing, yOffset + i * ySpacing);
    */

    i++;

  }

  this.hudTexture.needsUpdate = true;


  //renderer.render(this.scene, this.camera);

}














HUD.prototype.init2 = function(scene, camera) {

    // http://thehelpcentre.xyz/question/19046972/three-js-cannot-view-a-sprite-through-a-mesh-with-transparency

	// Ok, now we have the cube. Next we'll create the hud. For that we'll
    // need a separate scene which we'll render on top of our 3D scene. We'll
    // use a dynamic texture to render the HUD.

    var width = 200;
    var height = 15;

    // We will use 2D canvas element to render our HUD.
  	var hudCanvas = document.createElement('canvas');

    // Again, set dimensions to fit the screen.
    hudCanvas.width = width * 5;
    hudCanvas.height = height * 5;

    // Get 2D context and draw something supercool.
    var hudBitmap = hudCanvas.getContext('2d');
  	hudBitmap.font = "Normal 20px Arial";
    hudBitmap.textAlign = 'center';
    hudBitmap.fillStyle = "rgba(245,245,245,0.75)";
    hudBitmap.fillText('Initializing...', width / 2, height / 2);

  	// Create texture from rendered graphics.
  	var hudTexture = new THREE.Texture(hudCanvas)
  	hudTexture.needsUpdate = true;

    // Create HUD material.
    var material = new THREE.MeshBasicMaterial( {map: hudTexture} );
    material.transparent = true;

    var material2 = new THREE.MeshBasicMaterial( {color: 0xff0000} );

    // Create plane for hud.
    var geometry = new THREE.PlaneGeometry(width, height);
    this.plane = new THREE.Mesh( geometry, material2 );

    scene.add( this.plane );


}
