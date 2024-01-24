import {resolve} from 'path'
import {defineConfig} from 'vitest/config'
import dts from 'vite-plugin-dts'

export default defineConfig({
	test: {},
	build: {
		target: 'ES2020',
		lib: {
			entry: resolve(__dirname, 'src/main.ts'),
			name: 'main',
			fileName: 'main'
		},
		sourcemap: true,
		rollupOptions: {
			external: [
				// "node:util",
				// "node:buffer",
				"node:stream",
				// "node:net",
				// "node:url",
				// "node:fs",
				// "node:path",
				// "perf_hooks",
			],
			output: {
				globals: {
					"node:stream": "stream",
					// "node:buffer": "buffer",
					// "node:util": "util",
					// "node:net": "net",
					// "node:url": "url",
					// perf_hooks: "perf_hooks",
				},
				inlineDynamicImports: true,
			},
		},
	},
	plugins: [
		dts()

	]
})
