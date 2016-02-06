const rollup = require('rollup').rollup;
const babel = require('rollup-plugin-babel');

rollup({
	entry: 'src/number-formatter-generator.js',
	moduleName: 'numberFormatterGenerator',
	plugins: [
		babel(),
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
