var numberFormatterGenerator = require('../');
var assert = require('assert');

describe('format', function () {
	function format (mask, input) {
		return numberFormatterGenerator(mask)(input);
	}

	it('formats basic masks', function () {
		assert.equal(format('#,##0.00', 123456789.123), '123,456,789.12', 'Mask: "#,##0.00"');
		assert.equal(format('#,##0.00', 123456.789),    '123,456.79');
		assert.equal(format('#,##0.00', 123456.7),      '123,456.70');
		assert.equal(format('#,##0.00', 123456),        '123,456.00');
		assert.equal(format('#,##0.00', 0),             '0.00');
		assert.equal(format('#',        -0.1),          '');
		assert.equal(format('0',        -0.1),          '0');
		assert.equal(format('0.#',      -0.13),         '-0.1');
		assert.equal(format('#,##0.00', -123),          '-123.00');
		assert.equal(format('#,##0.00', -123456.789),   '-123,456.79');

		assert.equal(format('#,##0.0',  123456789.123), '123,456,789.1', 'Mask: "#,##0.0"');
		assert.equal(format('#,##0.0',  123456.789),    '123,456.8');
		assert.equal(format('#,##0.0',  123456.7),      '123,456.7');
		assert.equal(format('#,##0.0',  123456),        '123,456.0');
		assert.equal(format('#,##0.0',  0),             '0.0');
		assert.equal(format('#,##0.0',  -123),          '-123.0');
		assert.equal(format('#,##0.0',  -123456.789),   '-123,456.8');

		assert.equal(format('#,##0.',   123456789.123), '123,456,789', 'Mask: "#,##0."');
		assert.equal(format('#,##0.',   123456.789),    '123,457');
		assert.equal(format('#,##0.',   123456.7),      '123,457');
		assert.equal(format('#,##0.',   123456),        '123,456');
		assert.equal(format('#,##0.',   0),             '0');
		assert.equal(format('#,##0.',   -123),          '-123');
		assert.equal(format('#,##0.',   -123456.789),   '-123,457');

		assert.equal(format('#.##0,',   123456789.123), '123.456.789', 'Mask: "#.##0,"');
		assert.equal(format('#.##0,',   123456.789),    '123.457');
		assert.equal(format('#.##0,',   123456.7),      '123.457');
		assert.equal(format('#.##0,',   123456),        '123.456');
		assert.equal(format('#.##0,',   0),             '0');
		assert.equal(format('#.##0,',   -123),          '-123');
		assert.equal(format('#.##0,',   -123456.789),   '-123.457');

		assert.equal(format('#,##0.###0', 12345678.98765432), '12,345,678.9877', 'Mask: "#,##0.###0"');
	});

	/* Localizations */
	it('formats localizations', function () {
		assert.equal(format('### ###,##',   123456789.987654321), '123 456 789,99', 'Estonia, France: ### ###,##');
		assert.equal(format('##.000,00',    123456789.987654321), '123.456.789,99', 'Germany, Italy: ##.000,00');
		assert.equal(format('###,####.00',  123456789.987654321), '1,2345,6789.99', 'Japan: ###,####.00');
		assert.equal(format('#\'###\'#00.00', 123456789.987654321), '123\'456\'789.99', 'Switzerland: #\'###\'#00.00');
	});


	/* Precision */
	it('formats precision', function () {
		assert.equal(format('### ###,',   123456789.987654321), '123 456 790');
		assert.equal(format('###.###,',   123456789.987654321), '123.456.790');
		assert.equal(format('##,000.',    123456789.987654321), '123,456,790');
		assert.equal(format('###,####.',  123456789.187654321), '1,2345,6789');
		assert.equal(format('#\'###\'#00,', 123456789.087654321), '123\'456\'789');
	});



	/* Mask with prefix and/or suffix */
	it('formats prefix & Suffix', function () {
		// usage
		assert.equal(format('$#,##0.00USD',   123456789.123), '$123,456,789.12USD',   '$#,##0.00USD');
		assert.equal(format('$ #,##0.00 USD', 123456789.123), '$ 123,456,789.12 USD', '$ #,##0.00 USD');
		assert.equal(format('##.000,00 €',    123456789.123), '123.456.789,12 €',     '##.000,00 €');
		assert.equal(format('###,####.00 ¥',  123456789.123), '1,2345,6789.12 ¥',     '###,####.00 ¥');

		assert.equal(format('### ###,### ¢ and stuff', 123456789.123), '123 456 789,123 ¢ and stuff', '### ###,### ¢ and stuff');
		assert.equal(format('  #,##0.00 a b c ', 123456789.123),       '  123,456,789.12 a b c ',     'leading & trailing spaces');

		assert.equal(format('$  (#,###.00)  Money', 123456789.123), '$  (123,456,789.12)  Money', 'spaces & mask wrapped in parenthesis');
		assert.equal(format('prefix with a comma, includes everything? #.00 yep!', 123456789.123), 'prefix with a comma, includes everything? 123456789.12 yep!', 'prefix with a comma');
		assert.equal(format('$# ###,00 USD, or euros.', 123456789.123), '$123 456 789,12 USD, or euros.', 'suffix with comma & period');
		assert.equal(format('prefix with a periods?... #.00 yep!', 123456789.123), 'prefix with a periods?... 123456789.12 yep!', 'prefix with a periods');
		assert.equal(format('It costs $# ###,00 euros.', 123456789.123), 'It costs $123 456 789,12 euros.', 'suffix with period');
		assert.equal(format('test:### ###. ing', 123456789.123), 'test:123 456 789 ing', 'Hanging decimals');
	});

	it('does not format masks that don\'t work', function () {
		// not allowed
		assert.equal(format('No # outside of the mask $#,###.00', 123456789.123) !== 'No # outside of the mask $123,456,789.12', true, 'BROKEN: # outside of the mask');
		assert.equal(format('99 items = $#,###.00',               123456789.123) !== '99 items = $123,456,789.12',               true, 'BROKEN: numbers outside of mask');
		assert.equal(format('cost -- $#,###.00 -- value',         123456789.123) !== 'cost -- $123,456,789.12 -- value',         true, 'BROKEN: dashes outside of mask');
		assert.equal(format('++ value! $#,###.00 ++ value!',      123456789.123) !== '++ value! $123,456,789.12 ++ value!',      true, 'BROKEN: plus signs outside of mask');
	});

});
