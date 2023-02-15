import {resolve} from 'path'
import {defineConfig} from 'vitest/config'
import dts from 'vite-plugin-dts'
import rollupNodePolyFill from 'rollup-plugin-node-polyfills'

export default defineConfig({
	test: {},
	resolve: {
		alias: {
			child_process: ""
		}
	},
	build: {
		target: "es2015",
		lib: {
			entry: resolve(__dirname, 'src/main.ts'),
			name: 'main',
			fileName: 'main'
		}
	},
	plugins: [
		dts(),
		rollupNodePolyFill()
	]
})
