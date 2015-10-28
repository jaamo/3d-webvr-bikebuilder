/**
 * Bike.
 */
var HUD = new Function();

HUD.prototype.scene = false;
HUD.prototype.camera = false;

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
    var hudBitmap = hudCanvas.getContext('2d');
  	hudBitmap.font = "Normal 40px Arial";
    hudBitmap.textAlign = 'center';
    hudBitmap.fillStyle = "rgba(245,245,245,0.75)";
    hudBitmap.fillText('Initializing...', width / 2, height / 2);

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
