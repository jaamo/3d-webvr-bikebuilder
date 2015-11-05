/**
 * Bike.
 */
var Bike = new Function();

Bike.prototype.obj = false;

Bike.prototype.init = function(scene, successCallback) {

	var self = this;

	// Init collada-loader.
	var loader = new THREE.ColladaLoader();
	loader.options.convertUpAxis = true;

	// Load bianchi model.
	//loader.load( 'models/bianchi/BianchiPista3.dae', function ( collada ) {
	loader.load( 'models/sibbo/sibbo01-small.dae', function ( collada ) {

		console.log("Model loaded.");

		self.obj = collada.scene;

		// Adjust position.
		self.obj.scale.x = self.obj.scale.y = self.obj.scale.z = 60;
		self.obj.position.y = -200;
		self.obj.updateMatrix();

		// Add to scene.
		scene.add( self.obj );

		// Apply shadow to all meshes.
		// This might not be the most optimal way to do this.
		// Shadows might be enabled to objects that would never
		// cast shadow anyway. Like some nuts ect. But I think
		// this is fine right now.
		self.obj.traverse(function(obj) {
			if (obj.type == "Mesh") {
				obj.castShadow = true;
			}
		});

		successCallback();

	});

}



/**
 * Set color.
 *
 * @param  {String} group Group name (frame / saddle / tires).
 * @param  {Number} color Hex code: 0x00ff00
 */
Bike.prototype.setColor = function(group, color) {

	var self = this;

	if (group == "frame") {
		self.obj.getObjectByName("Frame").children[0].material.materials[0].color = new THREE.Color(color);
		self.obj.getObjectByName("Frame").children[0].material.materials[1].color = new THREE.Color(color);
	}

	if (group == "saddle") {
		self.obj.getObjectByName("Saddle").children[0].material.color = new THREE.Color(color);
		self.obj.getObjectByName("Saddle").children[0].material.color = new THREE.Color(color);
	}

	if (group == "tires") {
		self.obj.getObjectByName("RearWheel").children[0].material.materials[2].color = new THREE.Color(color);
	}


}
