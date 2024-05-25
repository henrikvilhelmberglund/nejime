<script lang="ts">
	import { activeScreenState } from "./globalState.svelte";
	import { toHex, toHexSingle } from "./utils";

	let songRows = Array.from({ length: 64 });
	let otherRows = Array.from({ length: 16 });

	function alternatingFourRows(i: number) {
		return (
			i % 16 === 0 ||
			i % 16 === 1 ||
			i % 16 === 2 ||
			i % 16 === 3 ||
			i % 16 === 8 ||
			i % 16 === 9 ||
			i % 16 === 10 ||
			i % 16 === 11
		);
	}
</script>

<div class="mr-4 flex flex-col text-lg text-white">
	{#if activeScreenState.value === "song"}
		{#each songRows as _, i}
			<span
				class:bg-selection-500={alternatingFourRows(i)}
				class:text-black={alternatingFourRows(i)}
				class=" h-5 px-1 leading-5">{toHex(i)}</span>
		{/each}
	{:else if activeScreenState.value === "pattern" || activeScreenState.value === "phrase"}
		{#each otherRows as _, i}
			<span
				class:bg-selection-500={alternatingFourRows(i)}
				class:text-black={alternatingFourRows(i)}
				class="h-5 px-1 leading-5">{toHexSingle(i)}</span>
		{/each}
	{/if}
</div>

<style>
</style>
