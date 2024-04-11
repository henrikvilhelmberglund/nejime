<script lang="ts">
	import PhraseSelector from "./PhraseSelector.svelte";

	// let channels = [1];
	let rows = Array.from({ length: 64 });
</script>

<main class="flex h-[800px] w-[600px] flex-col gap-2 overflow-hidden bg-blue-300">
	{#each rows as row, i}
		<div id={`row-${i}`} class="flex gap-2">
			<PhraseSelector id={`row-${i}-pattern`} />
		</div>
	{/each}
</main>

<style>
</style>
