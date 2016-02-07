const DEFAULT_GROUP_SEPARATOR = ',';
const DEFAULT_DECIMAL_SEPARATOR = '.';
const DEFAULT_GROUP_SIZE = 3;
const DEFAULT_DECIMAL_SIZE = 0;
const EXP_MASK = /^.*?([0-9+\-.,' #]+).*?$/;
const PAD_LEFT = true;
const PAD_RIGHT = false;

const {
	abs,
	pow,
	round,
	floor,
	ceil,
	log,
} = Math;

export default class Generator {

	static charIsMask (ch) {
		if (ch >= '0' && ch <= '9') {
			return true;
		}
		if (ch === '#') {
			return true;
		}
		return false;
	}

	static charIsSeparator (ch) {
		switch (ch) {
			case '.':
			case ',':
			case '\'':
			case ' ':
				return true;
			default:
				return false;
		}
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

	static formatInteger (value, { size = DEFAULT_GROUP_SIZE, separator = DEFAULT_GROUP_SEPARATOR, required = 0 } = {}) {
		const multiplier = pow(10, size);
		const groups = ceil(log(value + 1) / log(multiplier));
		let result = '';
		for (let i = 0; i < groups; i++) {
			let power = pow(multiplier, i);
			// The value of this group
			// e.g. 456 for the second group of 123,456,789
			let group = floor(value / power) % multiplier;
			// First and last groups for 123,456 are 123 and 456 respectively
			let last = (i === 0);
			let first = (i === groups - 1);
			result = (
				Generator.formatGroup(group, {
					// Resolve things like 001,001 or 1,1
					required: (first ? required : size),
				}) +
				// Only add a separator after all but the last group
				(last ? '' : separator) +
				result
			);
		}
		return result;
	}

	static formatFraction (value, { places = DEFAULT_DECIMAL_SIZE } = {}) {
		const multiplier = pow(10, places);
		const fraction = round(abs(value) * multiplier) % multiplier;
		return Generator.pad(fraction, '0', places, PAD_LEFT);
	}

	static formatGroup (value, { required = 0 } = {}) {
		let requiredPart = Generator.pad(value, '0', required, PAD_LEFT);
		requiredPart = requiredPart.substring(requiredPart.length - required);
		let optionalPart = String(floor(value / pow(10, required)) || '');
		return optionalPart + requiredPart;
	}

	static formatNegative (value) {
		return value < 0 ? '-' : '';
	}

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

	static parse (input) {
		return Object.assign({}, ...[
			Generator.parsePrefix(input),
			Generator.parseSuffix(input),
		]);
	}

	static parseDecimalSeparator (input, { start = 0, end = input.length } = {}) {
		let decimalSeparator = null;
		let decimalSeparatorIndex = null;
		for (let i = end - 1; i >= start; i++) {
			let ch = input.charAt(i);
			if (Generator.charIsSeparator(ch)) {
				decimalSeparator = ch;
				decimalSeparatorIndex = i;
				break;
			}
		}
		return {
			decimalSeparator,
			decimalSeparatorIndex,
		};
	}

	static parseGroupSeparator (input, { start = 0, end = input.length } = {}) {
		let groupSeparator = null;
		let groupSeparatorIndex = null;
		for (let i = start; i < end; i++) {
			let ch = input.charAt(i);
			if (Generator.charIsSeparator(ch)) {
				groupSeparator = ch;
				groupSeparatorIndex = i;
				break;
			}
		}
		return {
			groupSeparator,
		};
	}

	static parsePrefix (input) {
		const length = input.length;
		const startPrefix = 0;
		let endPrefix = 0;
		for (let i = 0; i < length; i++) {
			let ch = input.charAt(i);
			if (Generator.charIsMask(ch)) {
				endPrefix = i;
				break;
			}
		}
		return {
			startPrefix,
			endPrefix,
			prefix: input.substring(startPrefix, endPrefix),
		};
	}

	static parseSuffix (input) {
		const length = input.length;
		const endSuffix = length;
		let startSuffix = 0;
		for (let i = length - 1; i >= 0; i--) {
			let ch = input.charAt(i);
			if (Generator.charIsMask(ch)) {
				startSuffix = i + 1;
				break;
			}
		}
		return {
			startSuffix,
			endSuffix,
			suffix: input.substring(startSuffix, endSuffix),
		};
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
		this.groupSeparator = Generator.findGroupSeparator(mask) || DEFAULT_GROUP_SEPARATOR;
		this.groupSizeMultiplier = pow(10, this.groupSize);
		// Decimal
		this.decimalPlaces = DEFAULT_DECIMAL_SIZE;
		this.decimalSeparator = Generator.findDecimalSeparator(mask) || DEFAULT_DECIMAL_SEPARATOR;
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
		return Generator.formatFraction(value, {
			places: this.decimalPlaces,
		});
	}

	formatNegative (value) {
		return Generator.formatNegative(value);
	}

}
