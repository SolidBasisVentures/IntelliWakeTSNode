import {resolve} from 'path'
import {defineConfig} from 'vitest/config'
import dts from 'vite-plugin-dts'

export default defineConfig({
	test: {},
	build: {
		ssr: true,
		target: 'node20',
		lib: {
			entry: resolve(__dirname, 'src/main.ts'),
			name: 'main',
			fileName: (format) => `main.${format}.js`,
			formats: ['es']
		},
		sourcemap: true,
		rollupOptions: {
			external: [
				'pg', 'pg-pool', 'fs', 'net', 'dns', 'path', 'events', 'tls', 'stream', 'crypto'
			]
		},
		modulePreload: {
			polyfill: false
		}
	},
	plugins: [
		dts()
	],
	ssr: {
		noExternal: true // ['pg', 'pg-pool']  // Ensure these modules remain external for SSR if you're using SSR
	},
})
