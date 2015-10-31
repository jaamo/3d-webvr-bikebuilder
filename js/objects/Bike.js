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
			console.log(obj.name);
			if (obj.type == "Mesh") {
				obj.castShadow = true;
			}
		});

		// var group = this.colors[groupName];

		// Get new color
		// group.currentColor = (group.currentColor + 1) % group.colors.length;
		// var color = new THREE.Color(group.colors[ group.currentColor ]);

		console.log(self.obj.getObjectByName("RearWheel"));
		console.log(self.obj.getObjectByName("Saddle"));

		// Get materials for given objects.
		// for (var i in group.objects) {
		self.obj.getObjectByName("Frame").children[0].material.materials[0].color = new THREE.Color(0xff0000);
		self.obj.getObjectByName("Frame").children[0].material.materials[1].color = new THREE.Color(0xff0000);

		self.obj.getObjectByName("Saddle").children[0].material.color = new THREE.Color(0x00ff00);
		self.obj.getObjectByName("Saddle").children[0].material.color = new THREE.Color(0x00ff00);

		self.obj.getObjectByName("RearWheel").children[0].material.materials[2].color = new THREE.Color(0x0000ff);

		// }

		// return group.colors[ group.currentColor ];


		successCallback();


	});

}
