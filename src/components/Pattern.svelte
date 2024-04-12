<script lang="ts">
	import PhraseSelector from "./PhraseSelector.svelte";
	import VerticalNumbers from "./VerticalNumbers.svelte";

	// let channels = [1];
	let rows = Array.from({ length: 16 });
</script>

<main class="flex overflow-hidden">
	<VerticalNumbers />
	<div class="flex flex-col">
		{#each rows as _, i}
			<div id={`row-${i}`} class="flex gap-2">
				<PhraseSelector id={`row-${i}-pattern`} />
			</div>
		{/each}
	</div>
</main>

<style>
</style>
