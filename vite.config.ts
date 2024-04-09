import { sveltekit } from '@sveltejs/kit/vite';
// import { defineConfig } from 'vitest/config';
import { defineConfig } from 'vite';
import UnoCSS from '@unocss/svelte-scoped/vite';

export default defineConfig({
	plugins: [
		UnoCSS({
			injectReset: '@unocss/reset/tailwind.css',
		}),
		sveltekit()
	],
	// test: {
	// 	include: ['src/**/*.{test,spec}.{js,ts}']
	// }
});
