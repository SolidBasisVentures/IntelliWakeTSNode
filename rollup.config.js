import pkg from './package.json'
import typescript from 'rollup-plugin-typescript2'
import legacy from 'rollup-plugin-legacy'
import copy from 'rollup-plugin-copy'

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
		typescript({objectHashIgnoreUnknownHack: false}),
		legacy({
			'SFTP/index.js': 'SFTP'
		}),
		copy({
			targets: [
				{src: 'src/SFTP/**/*', dest: 'dist/SFTP'}
			]
		})
	],
	external: ['path', 'fs', 'moment-timezone', 'readline', '@solidbasisventures/intelliwaketsfoundation']
}
