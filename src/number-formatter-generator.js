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

	static pad (str, ch, len = 0, left = false) {
		str = String(str || '');
		ch = String(ch || '');
		len = Number(len);
		if (!ch || len <= 0 || str.length > len) {
			return str;
		}
		var diff = len - str.length;
		var iters = ceil(diff / ch.length);
		var padding = (new Array(iters + 1)).join(ch);
		padding = padding.substring(0, diff);
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

	static formatFraction (value, { places = DEFAULT_DECIMAL_SIZE, multiplier = pow(10, places) } = {}) {
		const fraction = round(abs(value) * multiplier) % multiplier;
		return NumberFormatterGenerator.pad(fraction, '0', places, true);
	}

	static formatGroup (value, { required = 0 } = {}) {
		let requiredPart = NumberFormatterGenerator.pad(value, '0', required, true);
		requiredPart = requiredPart.substring(requiredPart.length - required);
		let optionalPart = String(floor(value / pow(10, required)) || '');
		return optionalPart + requiredPart;
	}

	static formatNegative (value) {
		return value < 0 ? '-' : '';
	}

	constructor (input) {
		// Do not format values if not given a mask
		if (!input) {
			this.passthrough = true;
			return;
		}
		// Ensure input is string
		this.input = String(input);
		// Extract actual mask from input
		var match = input.match(EXP_MASK);
		if (!match) {
			throw new Error('Invalid mask');
		}
		var mask = match[1];
		this.prefix = input.substring(0, match.index);
		this.suffix = input.substring(match.index + mask.length);
		// Group
		this.groupSize = DEFAULT_GROUP_SIZE;
		this.groupSeparator = NumberFormatterGenerator.findGroupSeparator(mask) || DEFAULT_GROUP_SEPARATOR;
		this.groupSizeMultiplier = pow(10, this.groupSize);
		// Decimal
		this.decimalPlaces = DEFAULT_DECIMAL_SIZE;
		this.decimalSeparator = NumberFormatterGenerator.findDecimalSeparator(mask) || DEFAULT_DECIMAL_SEPARATOR;
		this.decimalMultiplier = pow(10, this.decimalPlaces);
	}

	format (input) {
		// Pass value through if not numeric
		if (this.passthrough || isNaN(input)) {
			return input;
		}
		// Ensure input is number
		input = Number(input);
		// No need to format these values
		if (isNaN(input)) {
			return 'NaN';
		}
		else if (input >= Infinity) {
			return 'Infinity';
		}
		else if (input <= -Infinity) {
			return '-Infinity';
		}
		var value = abs(input);
		var fraction = this.formatFraction(input);
		var floored = floor(value);
		var decimal = floored;
		var groups = [];
		while (floored > 0) {
			groups.unshift(floored % this.groupSizeMultiplier);
			floored = floor(floored / this.groupSizeMultiplier);
		}
		var result = groups.join(this.groupSeparator) + this.decimalSeparator + fraction;
		var negative = this.formatNegative(input);
		return this.prefix + negative + result + this.suffix;
	}

	formatFraction (value) {
		return NumberFormatterGenerator.formatFraction(value, {
			places: this.decimalPlaces,
			multiplier: this.decimalMultiplier,
		});
	}

	formatNegative (value) {
		return NumberFormatterGenerator.formatNegative(value);
	}

}
