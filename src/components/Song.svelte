<script lang="ts">
	import PatternSelector from "./PatternSelector.svelte";

	let channels = [1, 2, 3, 4, 5];
	let rows = Array.from({ length: 64 });
</script>

<main class="flex h-[800px] flex-col overflow-hidden gap-2 bg-blue-300">
	{#each rows as row, i}
		<div id={`row-${i}`} class="flex gap-2">
			{#each channels as channel, j}
				<PatternSelector id={`row-${i}-channel-${j}`} />
			{/each}
		</div>
	{/each}
</main>

<style>
</style>
