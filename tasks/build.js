const rollup = require('rollup').rollup;
const babel = require('rollup-plugin-babel');

rollup({
	entry: 'src/number-formatter-generator.js',
	plugins: [
		babel({
			presets: ['es2015-rollup'],
		}),
	],
}).then(function (bundle) {
	return bundle.write({
		format: 'umd',
		moduleName: 'numberFormatterGenerator',
		dest: 'dist/number-formatter-generator.js',
	});
}).catch(function (err) {
	console.error(err.message);
	process.exit(1);
});
