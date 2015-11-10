
/**
 * 3D scene.
 */
var GamepadControls = new Function();



/* Object of pressed keys. */
GamepadControls.prototype.keys = {};

/* Object of pressed keys. Previous state. */
GamepadControls.prototype.previousKeys = {};

/* Joystic threshold for analog movement. */
GamepadControls.prototype.threshold = 0.2;

/* Joystic threshold for "binary keypress". */
GamepadControls.prototype.pressThreshold = 0.5;

/* Map function names to keycode. */
GamepadControls.prototype.keyMap = {
	"axis1left": 65,
	"axis1right": 68,
	"axis1up": 87,
	"axis1down": 83,
	"axis3up": 73,
	"button1": 75,
	"button2": 74,
	"button3": 76
};


/* Connected gamepad. */
GamepadControls.prototype.gamepad = false;



/**
 * Init controls.
 */
GamepadControls.prototype.init = function init() {

	var self = this;

	$(document).keydown(function(e) {
		console.log(e.keyCode);
		self.keys[e.keyCode] = true;
	});

	$(document).keyup(function(e) {
		self.keys[e.keyCode] = false;
	});

	// Init gamapad.
	window.addEventListener("gamepadconnected", function(e) {
		self.initGamepad();
	});


};




/**
 * Get the first gamepad from gamepads list.
 */
GamepadControls.prototype.initGamepad = function() {

	var gamepads = navigator.getGamepads();
	if (gamepads.length > 0) {
		if (!this.gamepad && gamepads[0]) {
			console.log("Gamepad found!");
			console.log(gamepads[0]);
		}
		this.gamepad = gamepads[0];
	} else {
		console.log("Controller disconnected.");
		this.gamepad = false;
	}

}




/**
 * Check if given function is active.
 * @param  {String} fn Name of the function. For example "axis1left".
 * @return {Float}	  Zero if function is not active. Float between 0-1 if is active. Value represents the state of the analog controller.
 */
GamepadControls.prototype.active = function(fn) {

	// Update gamepad status.
	this.initGamepad();

	// Handle keyboard input.
	if (this.keyMap.hasOwnProperty(fn) && this.keys.hasOwnProperty(this.keyMap[fn]) && this.keys[this.keyMap[fn]]) {
		return true;
	}

	// Handle gamepad input.
	if (this.gamepad) {

		if (fn == "axis1left" && this.gamepad.axes[0] < -this.threshold) {
			return Math.abs(this.gamepad.axes[0]);
		}

		if (fn == "axis1right" && this.gamepad.axes[0] > this.threshold) {
			return Math.abs(this.gamepad.axes[0]);
		}

		if (fn == "axis1up" && this.gamepad.axes[1] < -this.threshold) {
			return Math.abs(this.gamepad.axes[1]);
		}

		if (fn == "axis1down" && this.gamepad.axes[1] > this.threshold) {
			return Math.abs(this.gamepad.axes[1]);
		}

		if (fn == "axis3left" && this.gamepad.axes[2] < -this.threshold) {
			return Math.abs(this.gamepad.axes[2]);
		}

		if (fn == "axis3right" && this.gamepad.axes[2] > this.threshold) {
			return Math.abs(this.gamepad.axes[2]);
		}

		if (fn == "axis3up" && this.gamepad.axes[3] < -this.threshold) {
			return Math.abs(this.gamepad.axes[3]);
		}

		if (fn == "axis3down" && this.gamepad.axes[3] > this.threshold) {
			return Math.abs(this.gamepad.axes[3]);
		}


	}

	return false;

}



/**
 * Return true if given function is pressed.
 *
 * @param  {String} fn Function name.
 * @return {Boolean}      Pressed or not.
 */
GamepadControls.prototype.pressed = function(fn) {

	// If previous state was true and the current state is false, key is pressed.
	if (this.previousKeys[this.keyMap[fn]] && !this.keys[this.keyMap[fn]]) {
		return true;
	}

	if (this.previousKeys[fn] && !this.keys[fn]) {
		return true;
	}


}

GamepadControls.prototype.initPressed = function() {

	// Handle gamepad input.
	if (this.gamepad) {

		if (this.gamepad.axes[2] < -this.pressThreshold) {
			this.keys["axis3left"] = true;
		} else {
			this.keys["axis3left"] = false;
		}

		if (this.gamepad.axes[2] > this.pressThreshold) {
			this.keys["axis3right"] = true;
		} else {
			this.keys["axis3right"] = false;
		}

		if (this.gamepad.axes[3] < -this.pressThreshold) {
			this.keys["axis3up"] = true;
		} else {
			this.keys["axis3up"] = false;
		}

		if (this.gamepad.axes[3] > this.pressThreshold) {
			this.keys["axis3down"] = true;
		} else {
			this.keys["axis3down"] = false;
		}

		this.keys["button0"] = this.gamepad.buttons[0].pressed;
		this.keys["button1"] = this.gamepad.buttons[1].pressed;
		this.keys["button2"] = this.gamepad.buttons[2].pressed;
		this.keys["button3"] = this.gamepad.buttons[3].pressed;

	}

}

GamepadControls.prototype.resetPressed = function() {
	this.previousKeys = JSON.parse(JSON.stringify(this.keys));;
}
