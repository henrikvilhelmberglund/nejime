<script lang="ts">
	import PhraseSelector from "./PhraseSelector.svelte";
	import TransposeSelector from "./TransposeSelector.svelte";
	import VerticalNumbers from "./VerticalNumbers.svelte";
	import {
		createActivePatternState,
		createPatternsState,
		createTransposePatternsState
	} from "./globalState.svelte";
	import { toHex } from "./utils";

	// let channels = [1];
	let rows = Array.from({ length: 16 });

	let patternState = createPatternsState();
	let transposePatternsState = createTransposePatternsState();
	let activePattern = createActivePatternState();
	// $inspect(patternState.value[activePattern.value])
</script>

<main class="flex overflow-hidden">
	<VerticalNumbers />
	<div class="flex flex-col">
		{#each rows as _, i}
			<div class="flex flex-row gap-12">
				<div id={`row${i}`} class="flex gap-2">
					<PhraseSelector
						selectedPhrase={patternState.value[activePattern.value as keyof typeof patternState.value]?.[toHex(i) as keyof typeof patternState.value] ?? "--"}
						hex={toHex(i)}
						id={`row${i}-pattern`} />
				</div>
				<div id={`row${i}-transpose-div`} class="flex gap-2 bg-primary-500">
					<TransposeSelector
						transpose={transposePatternsState.value[activePattern.value as keyof typeof patternState.value]?.[toHex(i) as keyof typeof patternState.value] ?? "00"}
						hex={toHex(i)}
						id={`row${i}-transpose`} />
				</div>
			</div>
		{/each}
	</div>
</main>

<style>
</style>
