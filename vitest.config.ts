import { defineConfig } from 'vitest/config'

export default defineConfig({
	test: {
		globals: true, // optional if you want describe/test without imports
	},
	deps: {
		// 👇 Tell Vitest to use your custom tsconfig
		tsconfig: 'tsconfig.vitest.json'
	}
})
