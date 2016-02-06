var NumberFormatterGenerator = require('../');
var assert = require('assert');

describe('NumberFormatterGenerator', function () {
	describe('.pad()', function () {
		const pad = NumberFormatterGenerator.pad;

		it('returns a string', function () {
			assert.equal(typeof pad(), 'string', 'No arguments');
		});

		it('returns the original string if no arguments', function () {
			assert.equal(pad('Hello world'), 'Hello world', 'Hello world');
		});

		it('returns the original string if no length', function () {
			assert.equal(pad('Hello world', 'x'), 'Hello world', 'x');
		});

		it('returns the original string if length shorter than input', function () {
			assert.equal(pad('Hello world', 'x', 3), 'Hello world', 3);
		});

		it('returns the original string if no character', function () {
			assert.equal(pad('Hello world', null, 100), 'Hello world', 'null');
			assert.equal(pad('Hello world', undefined, 100), 'Hello world', 'undefined');
			assert.equal(pad('Hello world', '', 100), 'Hello world', 'empty string');
		});

		it('correctly pads when given length', function () {
			assert.equal(pad('Hello world', 'x', 12), 'Hello worldx', '12');
			assert.equal(pad('Hello world', 'x', 15), 'Hello worldxxxx', '15');
			assert.equal(pad('Hello world', 'x', 100).length, 100, '100');
		});

		it('correctly pads when given more than a single character', function () {
			assert.equal(pad('Hello world', 'xyz', 12), 'Hello worldx', 'xyz, 12');
			assert.equal(pad('Hello world', 'xyz', 15), 'Hello worldxyzx', 'xyz, 15');
			assert.equal(pad('Hello world', 'xyz', 100).length, 100, 'xyz, 100');
			assert.equal(pad('xyz', 'Hello world', 15), 'xyzHello worldH', 'Hello world, 15');
		});

		it('pads to the right', function () {
			assert.equal(pad('Hello world', 'xyz', 12, false), 'Hello worldx', 'xyz, 12');
			assert.equal(pad('Hello world', 'xyz', 15, false), 'Hello worldxyzx', 'xyz, 15');
			assert.equal(pad('Hello world', 'xyz', 100, false).length, 100, 'xyz, 100');
			assert.equal(pad('xyz', 'Hello world', 15, false), 'xyzHello worldH', 'Hello world, 15');
		});

		it('pads to the left', function () {
			assert.equal(pad('Hello world', 'xyz', 12, true), 'xHello world', 'xyz, 12');
			assert.equal(pad('Hello world', 'xyz', 15, true), 'xyzxHello world', 'xyz, 15');
			assert.equal(pad('Hello world', 'xyz', 100, true).length, 100, 'xyz, 100');
			assert.equal(pad('xyz', 'Hello world', 15, true), 'Hello worldHxyz', 'Hello world, 15');
		});

		it('can have a zero-length input', function () {
			assert.equal(pad('', 'xyz', 12), 'xyzxyzxyzxyz', '12');
		});
	});

	describe('.formatFraction()', function () {
		const formatFraction = NumberFormatterGenerator.formatFraction;

		it('returns an empty string when given no options', function () {
			assert.equal(formatFraction(3.14), '');
		});

		it('returns a string', function () {
			assert.equal(formatFraction(3.14, { places: 2 }), '14', '2 places');
		});

		it('truncates', function () {
			assert.equal(formatFraction(3.14, { places: 0 }), '', '0 places');
			assert.equal(formatFraction(3.14, { places: 1 }), '1', '1 place');
		});

		it('pads', function () {
			assert.equal(formatFraction(3.14, { places: 3 }), '140', '3 places');
			assert.equal(formatFraction(3.14, { places: 4 }), '1400', '4 places');
			assert.equal(formatFraction(3.14, { places: 5 }), '14000', '5 places');
		});
	});

	describe('.formatNegative()', function () {
		const formatNegative = NumberFormatterGenerator.formatNegative;

		it('returns an empty string when positive', function () {
			assert.equal(formatNegative(100), '', '100');
			assert.equal(formatNegative(3.14), '', '3.14');
			assert.equal(formatNegative(0.14), '', '0.14');
			assert.equal(formatNegative(Infinity), '', 'Infinity');
		});

		it('returns an empty string when zero', function () {
			assert.equal(formatNegative(0), '', '0');
		});

		it('returns an empty string when not a number', function () {
			assert.equal(formatNegative(NaN), '', 'NaN');
		});

		it('returns a negative sign when negative', function () {
			assert.equal(formatNegative(-1), '-', '-1');
			assert.equal(formatNegative(-100), '-', '-100');
			assert.equal(formatNegative(-0.12), '-', '-0.12');
			assert.equal(formatNegative(-Infinity), '-', '-Infinity');
		});
	});

	describe('.formatGroup()', function () {
		const formatGroup = NumberFormatterGenerator.formatGroup;

		it('returns an empty string when given no options or value', function () {
			assert.equal(formatGroup(0), '', '0');
		});

		it('returns the input as a string when given no options', function () {
			assert.equal(formatGroup(1), '1', '1');
			assert.equal(formatGroup(100), '100', '100');
			assert.equal(formatGroup(123), '123', '123');
			assert.equal(formatGroup(123123123), '123123123', '123123123');
		});

		it('returns at least one character when given a required count of one', function () {
			assert.equal(formatGroup(0, { required: 1 }), '0', '0');
			assert.equal(formatGroup(1, { required: 1 }), '1', '1');
			assert.equal(formatGroup(34, { required: 1 }), '34', '34');
			assert.equal(formatGroup(99, { required: 1 }), '99', '99');
			assert.equal(formatGroup(100, { required: 1 }), '100', '100');
			assert.equal(formatGroup(1234, { required: 1 }), '1234', '1234');
			assert.equal(formatGroup(123123, { required: 1 }), '123123', '123123');
		});

		it('returns at least two characters when given a required count of two', function () {
			assert.equal(formatGroup(0, { required: 2 }), '00', '0');
			assert.equal(formatGroup(1, { required: 2 }), '01', '1');
			assert.equal(formatGroup(34, { required: 2 }), '34', '34');
			assert.equal(formatGroup(99, { required: 2 }), '99', '99');
			assert.equal(formatGroup(100, { required: 2 }), '100', '100');
			assert.equal(formatGroup(1234, { required: 2 }), '1234', '1234');
			assert.equal(formatGroup(123123, { required: 2 }), '123123', '123123');
		});

		it('returns at least five characters when given a required count of five', function () {
			assert.equal(formatGroup(0, { required: 5 }), '00000', '0');
			assert.equal(formatGroup(1, { required: 5 }), '00001', '1');
			assert.equal(formatGroup(34, { required: 5 }), '00034', '34');
			assert.equal(formatGroup(99, { required: 5 }), '00099', '99');
			assert.equal(formatGroup(100, { required: 5 }), '00100', '100');
			assert.equal(formatGroup(1234, { required: 5 }), '01234', '1234');
			assert.equal(formatGroup(123123, { required: 5 }), '123123', '123123');
		});
	});
});
