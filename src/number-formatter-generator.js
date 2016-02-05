var EXP_MASK = /^.*?([0-9+\-.,' #]+).*?$/;

var abs = Math.abs;
var pow = Math.pow;
var round = Math.round;
var floor = Math.floor;

module.exports = function (input) {
	// Do not format values if not given a mask
	if (!input) {
		return function format (input) { return input };
	}
	// Ensure input is string
	input = String(input);
	// Extract actual mask from input
	var match = input.match(EXP_MASK);
	if (!match) {
		throw new Error('Invalid mask');
	}
	var mask = match[1];
	var prefix = input.substring(0, match.index);
	var suffix = input.substring(match.index + mask.length);
	var groupSeparator = ',';
	var groupSize = 3;
	var groupSizeMultiplier = pow(10, groupSize);
	var decimalSeparator = '.';
	var decimalPlaces = 2;
	var decimalPlacesMultiplier = pow(10, decimalPlaces);
	return function format (input) {
		// Pass value through if not numeric
		if (isNaN(input)) {
			return input;
		}
		// Ensure input is number
		input = Number(input);
		var isNegative = input < 0;
		var value = abs(input);
		var fraction = round(value * decimalPlacesMultiplier) % decimalPlacesMultiplier;
		var floored = floor(value);
		var decimal = floored;
		var groups = [];
		while (floored > 0) {
			groups.unshift(floored % groupSizeMultiplier);
			floored = floor(floored / groupSizeMultiplier);
		}
		var result = groups.join(groupSeparator) + decimalSeparator + fraction;
		return prefix + (isNegative ? '-' : '') + result + suffix;
	};
};
