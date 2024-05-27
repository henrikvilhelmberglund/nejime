<script lang="ts">
	import PhraseSelector from "./PhraseSelector.svelte";
	import TransposeSelector from "./TransposeSelector.svelte";
	import VerticalNumbers from "./VerticalNumbers.svelte";
	import {
		activeScreenState,
		isPlayingBack,
		lastPatternHex,
		lastRowPhrase,
		patterns,
		createPlayPositionsPatternsState,
		transposePatterns,
		lastPhraseHex,
		lastChannelPattern
	} from "./globalState.svelte";
	import { toHex } from "./utils";

	// type PatternProps = {
	//   text: string
	// }
	// let { text }: PatternProps = $props();

	// let channels = [1];
	let rows = Array.from({ length: 16 });

	let playPositionsPattern = createPlayPositionsPatternsState();

	$effect(() => {
		if (lastRowPhrase.value !== undefined) {
			queueMicrotask(() => {
				document
					.querySelector<HTMLButtonElement>(`#nejime #row${lastRowPhrase.value}-pattern`)!
					.focus();
				lastPhraseHex.value = (<HTMLButtonElement>document.activeElement).innerText;
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
				lastPhraseHex.value = (<HTMLButtonElement>document.activeElement).innerText;
			});
		}
	});

	$inspect(lastPatternHex.value);
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
					<!-- TODO cursor shows in patterns that are not playing atm -->
					<!-- TODO check channel instead of assuming "0" -->
					{#if isPlayingBack.value && playPositionsPattern.value["0"] === i}
						<div class="i-ph-play-fill absolute -left-4 py-[10px] text-xs text-white"></div>
					{/if}
					<PhraseSelector
						selectedPhrase={patterns.value[lastPatternHex.value as keyof typeof patterns.value]?.[toHex(i) as keyof typeof patterns.value] ?? "--"}
						hex={toHex(i)}
						id={`row${i}-pattern`} />
				</div>
				<div id={`row${i}-transpose-div`} class="bg-primary-500 flex gap-2">
					<TransposeSelector
						transpose={transposePatterns.value[lastPatternHex.value as keyof typeof patterns.value]?.[toHex(i) as keyof typeof patterns.value] ?? "00"}
						hex={toHex(i)}
						id={`row${i}-transpose`} />
				</div>
			</div>
		{/each}
	</div>
</main>

<style>
</style>
