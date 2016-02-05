var EXP_MASK = /^.*?([0-9+\-.,' #]+).*?$/;

var abs = Math.abs;

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
	return function format (input) {
		// Pass value through if not numeric
		if (isNaN(input)) {
			return input;
		}
		// Ensure input is number
		input = Number(input);
		var isNegative = input < 0;
		var value = abs(input);
		var result = String(value);
		return prefix + (isNegative ? '-' : '') + result + suffix;
	};
};
