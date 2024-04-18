<script lang="ts">
	import PhraseSelector from "./PhraseSelector.svelte";
	import TransposeSelector from "./TransposeSelector.svelte";
	import VerticalNumbers from "./VerticalNumbers.svelte";
	import {
		createActivePatternState,
		createActivePhraseElementIdState,
		createActivePhraseState,
		createPatternsState,
		createTransposePatternsState
	} from "./globalState.svelte";
	import { toHex } from "./utils";

	// let channels = [1];
	let rows = Array.from({ length: 16 });

	let patternState = createPatternsState();
	let transposePatternsState = createTransposePatternsState();
	let activePattern = createActivePatternState();
	let activePhrase = createActivePhraseState();
	let activePhraseElementId = createActivePhraseElementIdState();

	$effect(() => {
		if (activePhraseElementId && activePhraseElementId.value) {
			queueMicrotask(() => {
				document
					.querySelector<HTMLButtonElement>(`#nejime #${activePhraseElementId.value}`)!
					.focus();
			});
		} else {
			// console.log(document.querySelector("#nejime button"))
			console.log(document.querySelector<HTMLButtonElement>("#nejime button"));
			// setTimeout(() => {
			// 	document.querySelector<HTMLButtonElement>("#nejime button")!.focus();
			// }, 0);
			const phraseSelector = document.querySelector<HTMLButtonElement>("#nejime button")!;
			queueMicrotask(() => {
				phraseSelector.focus();
			});
			activePhrase.value = phraseSelector.innerText;
			// }
		}
	});
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
				<div id={`row${i}-transpose-div`} class="bg-primary-500 flex gap-2">
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
