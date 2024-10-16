import {resolve} from 'path'
import {defineConfig} from 'vitest/config'
import dts from 'vite-plugin-dts'

export default defineConfig({
	test: {},
	build: {
		target: 'es2015',
		lib: {
			entry: resolve(__dirname, 'src/main.ts'),
			name: 'main',
			fileName: 'main'
		},
		sourcemap: true,
		rollupOptions: {
			external: [
				'pg', 'pg-pool', 'fs', 'net', 'dns', 'path', 'events', 'tls', 'stream', 'crypto',
			],
		},
		// rollupOptions: {
		// 	external: [
		// 		// "node:util",
		// 		// "node:buffer",
		// 		"node:stream",
		// 		// "node:net",
		// 		// "node:url",
		// 		// "node:fs",
		// 		// "node:path",
		// 		// "perf_hooks",
		// 	],
		// 	output: {
		// 		globals: {
		// 			"node:stream": "stream",
		// 			// "node:buffer": "buffer",
		// 			// "node:util": "util",
		// 			// "node:net": "net",
		// 			// "node:url": "url",
		// 			// perf_hooks: "perf_hooks",
		// 		},
		// 		inlineDynamicImports: true,
		// 	},
		// },
	},
	plugins: [
		dts()
	],
	ssr: {
		noExternal: ['pg', 'pg-pool']  // Ensure these modules remain external for SSR if you're using SSR
	},
})
