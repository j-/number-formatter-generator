const DEFAULT_GROUP_SEPARATOR = ',';
const DEFAULT_DECIMAL_SEPARATOR = '.';
const DEFAULT_GROUP_SIZE = 3;
const DEFAULT_DECIMAL_SIZE = 0;
const EXP_MASK = /^.*?([0-9+\-.,' #]+).*?$/;

const {
	abs,
	pow,
	round,
	floor,
	ceil,
} = Math;

export default class NumberFormatterGenerator {

	static pad (str, ch, len, left) {
		str = String(str);
		ch = String(ch);
		len = Number(len);
		if (!str || !ch || len <= 0 || str.length > len) {
			return str;
		}
		var diff = ceil(len - str.length) / ch.length;
		var padding = (new Array(diff + 1)).join(ch);
		padding = padding.substring(0, diff); // TODO: test if necessary
		return left ? (padding + str) : (str + padding);
	}

	static findGroupSeparator (mask) {
		var result = mask.match(/[.,' ]/);
		if (!result) {
			return null;
		}
		return result[0];
	}

	static findDecimalSeparator (mask) {
		var result = mask.split('').reverse().join('').match(/[.,' ]/);
		if (!result) {
			return null;
		}
		return result[0];
	}

	constructor (input) {
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
		// Group
		var groupSeparator = NumberFormatterGenerator.findGroupSeparator(mask) || DEFAULT_GROUP_SEPARATOR;
		var groupSize = DEFAULT_GROUP_SIZE;
		var groupSizeMultiplier = pow(10, groupSize);
		// Decimal
		var decimalSeparator = NumberFormatterGenerator.findDecimalSeparator(mask) || DEFAULT_DECIMAL_SEPARATOR;
		var decimalPlaces = DEFAULT_DECIMAL_SIZE;
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
			fraction = NumberFormatterGenerator.pad(fraction, '0', decimalPlaces, true);
			var floored = floor(value);
			var decimal = floored;
			var groups = [];
			while (floored > 0) {
				groups.unshift(floored % groupSizeMultiplier);
				floored = floor(floored / groupSizeMultiplier);
			}
			var result = groups.join(groupSeparator) + decimalSeparator + fraction;
			return prefix + (isNegative ? '-' : '') + result + suffix;
		}
	}

}
