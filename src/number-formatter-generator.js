var EXP_MASK = /^.*?([0-9+\-.,' #]+).*?$/;

module.exports = function (input) {
	input = String(input);
	var match = input.match(EXP_MASK);
	if (!match) {
		throw new Error('Invalid mask');
	}
	var mask = match[1];
	var prefix = input.substring(0, match.index);
	var suffix = input.substring(match.index + mask.length);
	return function format (input) {

	};
};
