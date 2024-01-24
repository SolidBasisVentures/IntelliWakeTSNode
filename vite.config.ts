import {resolve} from 'path'
import {defineConfig} from 'vitest/config'
import dts from 'vite-plugin-dts'

export default defineConfig({
	test: {},
	build: {
		target: 'node20',
		lib: {
			entry: resolve(__dirname, 'src/main.ts'),
			name: 'main',
			fileName: 'main'
		},
	},
	plugins: [
		dts()

	]
})
