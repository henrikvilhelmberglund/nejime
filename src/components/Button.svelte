<script lang="ts">
	import type { Snippet } from 'svelte';
	import type { MouseEventHandler } from 'svelte/elements';

	type ButtonProps = {
		onclick: MouseEventHandler<HTMLButtonElement>;
		disabled?: boolean;
    children: Snippet;
	};
	let { children, disabled, ...rest }: ButtonProps = $props();
</script>

<button
	{...rest}
	{disabled}
	class="m-1 rounded-lg border border-primary-500 p-2 text-black dark:text-white hover:border-white active:bg-primary-300 disabled:cursor-not-allowed">
	{#if children}
		{@render children()}
	{:else}
		Missing button text
	{/if}
</button>
