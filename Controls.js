
/**
 * 3D scene.
 */
var GamepadControls = new Function();



/* Object of pressed keys. */
GamepadControls.prototype.keys = {};



/* Map function names to keycode. */
GamepadControls.prototype.keyMap = {
	"axis1left": 12
};



/**
 * Init controls.
 */
GamepadControls.prototype.init = function init() {

	$(document).keydown(function(e) {
		this.keys[e.keyCode] = 1;
	});

	$(document).keyup(function(e) {
		this.keys[e.keyCode] = 0;
		console.log(this.keys);
	});

};



/**
 * Check if given function is active.
 * @param  {String} fn Name of the function. For example "axis1left".
 * @return {Float}      Zero if function is not active. Float between 0-1 if is active. Value represents the state of the analog controller.
 */
GamepadControls.prototype.pressed = function active(fn) {

	if ()

}
