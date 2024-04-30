<script lang="ts">
	import PhraseSelector from "./PhraseSelector.svelte";
	import TransposeSelector from "./TransposeSelector.svelte";
	import VerticalNumbers from "./VerticalNumbers.svelte";
	import {
		createActiveScreenState,
		createIsPlayingBackState,
		createLastPatternHexState,
		createLastRowPhraseState,
		createPatternsState,
		createPlayPositionPatternState,
		createTransposePatternsState
	} from "./globalState.svelte";
	import { toHex } from "./utils";

	// type PatternProps = {
	//   text: string
	// }
	// let { text }: PatternProps = $props();

	// let channels = [1];
	let rows = Array.from({ length: 16 });

	let patternState = createPatternsState();
	let transposePatternsState = createTransposePatternsState();
	let lastRowPhrase = createLastRowPhraseState();
	let isPlayingBack = createIsPlayingBackState();
	let playPositionPattern = createPlayPositionPatternState();

	$effect(() => {
		if (lastRowPhrase.value !== undefined) {
			queueMicrotask(() => {
				document
					.querySelector<HTMLButtonElement>(`#nejime #row${lastRowPhrase.value}-pattern`)!
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
				// lastRowPhrase.value = 0;
				phraseSelector.focus();
			});
		}

		// this was set when BPM was changed, HMM
		if (
			activeElement.id !== "bpm-selector" &&
			!activeElement.id.includes("instrument-selector") &&
			activeElement.innerText.length === 2
		) {
			lastPatternHex.value = activeElement.innerText;
		}
	});

	let lastPatternHex = createLastPatternHexState();
	let activeElement = <HTMLButtonElement>document.activeElement;
	$inspect(lastPatternHex.value);
	let activeScreenState = createActiveScreenState();
</script>

<p class="pl-1 text-lg font-semibold text-white">
	{activeScreenState.value.toUpperCase()}
	{lastPatternHex.value}
</p>
<main class="flex overflow-hidden">
	<VerticalNumbers />
	<div class="relative flex flex-col">
		{#each rows as _, i}
			<div class="flex flex-row gap-12">
				<div id={`row${i}`} class="flex gap-2">
					{#if isPlayingBack.value && playPositionPattern.value === i}
						<div class="i-ph-play-fill absolute -left-4 py-[10px] text-xs text-white"></div>
					{/if}
					<PhraseSelector
						selectedPhrase={patternState.value[lastPatternHex.value as keyof typeof patternState.value]?.[toHex(i) as keyof typeof patternState.value] ?? "--"}
						hex={toHex(i)}
						id={`row${i}-pattern`} />
				</div>
				<div id={`row${i}-transpose-div`} class="bg-primary-500 flex gap-2">
					<TransposeSelector
						transpose={transposePatternsState.value[lastPatternHex.value as keyof typeof patternState.value]?.[toHex(i) as keyof typeof patternState.value] ?? "00"}
						hex={toHex(i)}
						id={`row${i}-transpose`} />
				</div>
			</div>
		{/each}
	</div>
</main>

<style>
</style>
