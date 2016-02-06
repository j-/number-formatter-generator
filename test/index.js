var NumberFormatterGenerator = require('../');
var assert = require('assert');

describe.skip('format', function () {
	function format (mask, input) {
		var generator = new NumberFormatterGenerator(mask);
		return generator.format(input);
	}

	function test (mask, input, expected) {
		assert.equal(
			format(mask, input),
			expected,
			'Mask: ' + mask + ', Input: ' + input
		);
	}

	it('formats basic masks', function () {
		test('#,##0.00', 123456789.123,  '123,456,789.12');
		test('#,##0.00', 123456.789,     '123,456.79');
		test('#,##0.00', 123456.7,       '123,456.70');
		test('#,##0.00', 123456,         '123,456.00');
		test('#,##0.00', 0,              '0.00');
		test('#',        -0.1,           '');
		test('0',        -0.1,           '0');
		test('0.#',      -0.13,          '-0.1');
		test('#,##0.00', -123,           '-123.00');
		test('#,##0.00', -123456.789,    '-123,456.79');

		test('#,##0.0',  123456789.123,  '123,456,789.1');
		test('#,##0.0',  123456.789,     '123,456.8');
		test('#,##0.0',  123456.7,       '123,456.7');
		test('#,##0.0',  123456,         '123,456.0');
		test('#,##0.0',  0,              '0.0');
		test('#,##0.0',  -123,           '-123.0');
		test('#,##0.0',  -123456.789,    '-123,456.8');

		test('#,##0.',   123456789.123,  '123,456,789');
		test('#,##0.',   123456.789,     '123,457');
		test('#,##0.',   123456.7,       '123,457');
		test('#,##0.',   123456,         '123,456');
		test('#,##0.',   0,              '0');
		test('#,##0.',   -123,           '-123');
		test('#,##0.',   -123456.789,    '-123,457');

		test('#.##0,',   123456789.123,  '123.456.789');
		test('#.##0,',   123456.789,     '123.457');
		test('#.##0,',   123456.7,       '123.457');
		test('#.##0,',   123456,         '123.456');
		test('#.##0,',   0,              '0');
		test('#.##0,',   -123,           '-123');
		test('#.##0,',   -123456.789,    '-123.457');

		test('#,##0.###0', 12345678.98765432, '12,345,678.9877');
	});

	/* Localizations */
	it('formats localizations', function () {
		test('### ###,##',   123456789.987654321, '123 456 789,99', 'Estonia, France: ### ###,##');
		test('##.000,00',    123456789.987654321, '123.456.789,99', 'Germany, Italy: ##.000,00');
		test('###,####.00',  123456789.987654321, '1,2345,6789.99', 'Japan: ###,####.00');
		test('#\'###\'#00.00', 123456789.987654321, '123\'456\'789.99', 'Switzerland: #\'###\'#00.00');
	});


	/* Precision */
	it('formats precision', function () {
		test('### ###,',   123456789.987654321, '123 456 790');
		test('###.###,',   123456789.987654321, '123.456.790');
		test('##,000.',    123456789.987654321, '123,456,790');
		test('###,####.',  123456789.187654321, '1,2345,6789');
		test('#\'###\'#00,', 123456789.087654321, '123\'456\'789');
	});



	/* Mask with prefix and/or suffix */
	it('formats prefix & Suffix', function () {
		// usage
		test('$#,##0.00USD',   123456789.123, '$123,456,789.12USD',   '$#,##0.00USD');
		test('$ #,##0.00 USD', 123456789.123, '$ 123,456,789.12 USD', '$ #,##0.00 USD');
		test('##.000,00 €',    123456789.123, '123.456.789,12 €',     '##.000,00 €');
		test('###,####.00 ¥',  123456789.123, '1,2345,6789.12 ¥',     '###,####.00 ¥');

		test('### ###,### ¢ and stuff', 123456789.123, '123 456 789,123 ¢ and stuff', '### ###,### ¢ and stuff');
		test('  #,##0.00 a b c ', 123456789.123,       '  123,456,789.12 a b c ',     'leading & trailing spaces');

		test('$  (#,###.00)  Money', 123456789.123, '$  (123,456,789.12)  Money', 'spaces & mask wrapped in parenthesis');
		test('prefix with a comma, includes everything? #.00 yep!', 123456789.123, 'prefix with a comma, includes everything? 123456789.12 yep!', 'prefix with a comma');
		test('$# ###,00 USD, or euros.', 123456789.123, '$123 456 789,12 USD, or euros.', 'suffix with comma & period');
		test('prefix with a periods?... #.00 yep!', 123456789.123, 'prefix with a periods?... 123456789.12 yep!', 'prefix with a periods');
		test('It costs $# ###,00 euros.', 123456789.123, 'It costs $123 456 789,12 euros.', 'suffix with period');
		test('test:### ###. ing', 123456789.123, 'test:123 456 789 ing', 'Hanging decimals');
	});

});
