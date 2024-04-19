<script lang="ts">
	import NoteSelector from "./NoteSelector.svelte";
	import PatternSelector from "./PatternSelector.svelte";
	import VerticalNumbers from "./VerticalNumbers.svelte";
	import {
		createActiveNoteElementIdState,
		createActiveNoteState,
		createActivePatternElementIdState,
		createActivePatternState,
		createActivePhraseElementIdState,
		createActivePhraseState,
		createIsPlayingBackState,
		createPhrasesState,
		createPlayPositionState,
		createSongState
	} from "./globalState.svelte";
	import { toHex } from "./utils";

	let channels = [0, 1, 2, 3, 4];
	let rows = Array.from({ length: 16 });

	let phrasesState = createPhrasesState();
	let activePhraseElementId = createActivePhraseElementIdState();
	let activePhrase = createActivePhraseState();
	let activeNoteElementId = createActiveNoteElementIdState();
	let activeNote = createActiveNoteState();
	let isPlayingBackState = createIsPlayingBackState();
	let playPositionState = createPlayPositionState();

	interface Pattern {
		channel0: string;
		channel1: string;
		channel2: string;
		channel3: string;
		channel4: string;
	}

	$effect(() => {
		if (activeNoteElementId && activeNoteElementId.value) {
			console.log("active note element id", activeNoteElementId.value);
			queueMicrotask(() => {
				document.querySelector<HTMLButtonElement>(`#nejime #${activeNoteElementId.value}`)!.focus();
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
	});
  // $inspect(playPositionState.value);
</script>

<main class="flex overflow-hidden">
	<VerticalNumbers />
	<div class="relative flex flex-col">
    {#each rows as row, i}
    <div id={`note${i}`} class="flex gap-4">
      {#if isPlayingBackState.value && playPositionState.value === i}
        <div class="text-xs absolute -left-4 py-[10px] text-white i-ph-play-fill"></div>
      {/if}
      {#each channels as channel, j}
					<NoteSelector
						selectedNote={phrasesState.value?.[activePhrase.value as keyof typeof phrasesState.value]?.[toHex(j) as keyof Pattern]?.[toHex(i) as keyof Pattern] ?? "---"}
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
