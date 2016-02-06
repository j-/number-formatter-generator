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
	});
});
