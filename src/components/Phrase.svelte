<script lang="ts">
	import NoteSelector from "./NoteSelector.svelte";
	import PatternSelector from "./PatternSelector.svelte";
	import VerticalNumbers from "./VerticalNumbers.svelte";
	import {
		createActiveScreenState,
		createIsPlayingBackState,
		createLastChannelNoteState,
		createLastPhraseHexState,
		createLastRowNoteState,
		createPhrasesState,
		createPlayPositionState,
		createSongState
	} from "./globalState.svelte";
	import { toHex } from "./utils";

	let channels = [0, 1, 2, 3, 4];
	let rows = Array.from({ length: 16 });

	let phrasesState = createPhrasesState();
	let isPlayingBackState = createIsPlayingBackState();
	let playPositionState = createPlayPositionState();
	let lastChannelNote = createLastChannelNoteState();
	let lastRowNote = createLastRowNoteState();

	interface Phrase {
		"00"?: string;
		"01"?: string;
		"02"?: string;
		"03"?: string;
		"04"?: string;
	}

	$effect(() => {
		if (lastRowNote.value !== undefined) {
			queueMicrotask(() => {
				document
					.querySelector<HTMLButtonElement>(
						`#nejime #note${lastRowNote.value}-channel${lastChannelNote.value}`
					)!
					.focus();
			});
		} else {
			// console.log(document.querySelector("#nejime button"))
			console.log(document.querySelector<HTMLButtonElement>("#nejime button"));
			// setTimeout(() => {
			// 	document.querySelector<HTMLButtonElement>("#nejime button")!.focus();
			// }, 0);
			const noteSelector = document.querySelector<HTMLButtonElement>("#nejime button")!;
			queueMicrotask(() => {
				noteSelector.focus();
			});
			// activePattern.value = patternSelector.innerText;
			// }
		}
		if (activeElement.innerText.length === 2) {
			lastPhraseHex.value = activeElement.innerText;
		}
	});

	let activeElement = $state(<HTMLButtonElement>document.activeElement);
	let activeScreenState = createActiveScreenState();
	let lastPhraseHex = createLastPhraseHexState();
</script>

<p class="pl-1 text-lg font-semibold text-white">
	{activeScreenState.value.toUpperCase()}
	{lastPhraseHex.value}
</p>
<div class="flex flex-row text-white text-sm pl-[39px]">
	<p class="w-64">NOTE</p>
	<p class="w-16">INSTR</p>
	<p>CMD</p>
</div>
<main class="flex overflow-hidden">
	<VerticalNumbers />
	<div class="relative flex flex-col">
		{#each rows as row, i}
			<div id={`note${i}`} class="flex gap-4">
				{#if isPlayingBackState.value && playPositionState.value === i}
					<div class="i-ph-play-fill absolute -left-4 py-[10px] text-xs text-white"></div>
				{/if}
				{#each channels as channel, j}
					<NoteSelector
						selectedNote={phrasesState.value?.[activeElement!.innerText]?.[toHex(j)]?.[toHex(i)] ?? "---"}
						hex={toHex(i)}
						channel={`channel${j}`}
						id={`note${i}-channel${j}`} />
				{/each}
			</div>
		{/each}
	</div>
</main>

<style>
</style>
