<script lang="ts">
	import PatternSelector from "./PatternSelector.svelte";
	import VerticalNumbers from "./VerticalNumbers.svelte";

	let channels = [1, 2, 3, 4, 5];
	let rows = Array.from({ length: 64 });
</script>

<main class="flex overflow-hidden">
  <VerticalNumbers />
	<div class="flex flex-col">
		{#each rows as row, i}
			<div id={`row-${i}`} class="flex gap-4">
				{#each channels as channel, j}
					<PatternSelector id={`row-${i}-channel-${j}`} />
				{/each}
			</div>
		{/each}
	</div>
</main>

<style>
</style>
