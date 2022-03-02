import pkg from './package.json'
import typescript from 'rollup-plugin-typescript2'

export default {
	input: [
		'src/main.ts'
	],
	output: [
		{
			file: pkg.main,
			format: 'cjs'
			// file: 'dist/main.js',
			// format: 'esm'
		}
	],
	plugins: [
		typescript({objectHashIgnoreUnknownHack: false})
	],
	external: ['path', 'fs', 'moment-timezone', 'readline', '@solidbasisventures/intelliwaketsfoundation']
}
