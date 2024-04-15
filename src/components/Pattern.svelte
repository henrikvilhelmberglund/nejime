<script lang="ts">
	import PhraseSelector from "./PhraseSelector.svelte";
	import VerticalNumbers from "./VerticalNumbers.svelte";
	import { createActivePatternState, createPatternsState } from "./globalState.svelte";
	import { toHex } from "./utils";

	// let channels = [1];
	let rows = Array.from({ length: 16 });

  let patternState = createPatternsState();
  let activePattern = createActivePatternState();
  // $inspect(activePatternElementId.value)
</script>

<main class="flex overflow-hidden">
	<VerticalNumbers />
	<div class="flex flex-col">
		{#each rows as _, i}
			<div id={`row-${i}`} class="flex gap-2">
				<PhraseSelector 
        selectedPhrase={patternState.value[toHex(i) as keyof typeof patternState.value]?.[activePattern.value] ?? "--"}
						hex={toHex(i)}
        id={`row${i}-pattern`} />
			</div>
		{/each}
	</div>
</main>

<style>
</style>
