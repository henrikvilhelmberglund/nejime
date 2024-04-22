<script lang="ts">
	import {
		createSPressedState,
		createDPressedState,
		createFPressedState,
		createLastRowNoteState,
		createLastChannelNoteState
	} from "./globalState.svelte";
	import { addSpace } from "./utils";
	import DOMPurify from "isomorphic-dompurify";

	let {
		id,
		hex,
		channel,
		selectedNote
	}: { id: string; hex: string; channel: string; selectedNote: string } = $props();
	// let name = $state("--");
	let sPressed = createSPressedState();
	let dPressed = createDPressedState();
	let fPressed = createFPressedState();
	let lastRowNote = createLastRowNoteState();
	let lastChannelNote = createLastChannelNoteState();

	// let el = document.getElementById("div-1").nextSibling;

	function focusNoteSelector({ row, channel }: { row: number; channel: number }) {
		try {
			const noteSelector: HTMLButtonElement = document.querySelector(
				`#note${row}-channel${+channel}`
			)!;
			noteSelector.focus();
			lastRowNote.value = row;
			lastChannelNote.value = channel;
			// activeNote.value = noteSelector.innerText;
		} catch (error) {
			console.error(`element ${`#note${row}-channel${+channel}`} not found, can't focus`);
		}
	}

	function handleKeyPress(e: KeyboardEvent) {
		const row = id.split("note")[1].split("-channel")[0];
		const channel = id.split("note")[1].split("-channel")[1];
		e.preventDefault();
		// if s, d or f are pressed, don't use below logic that switches cursor location
		if (sPressed.value || dPressed.value || fPressed.value) return;

		if (e.code === "ArrowLeft") {
			focusNoteSelector({ row: parseInt(row), channel: parseInt(channel) - 1 });
		} else if (e.code === "ArrowRight") {
			focusNoteSelector({ row: parseInt(row), channel: parseInt(channel) + 1 });
		} else if (e.code === "ArrowUp") {
			focusNoteSelector({ row: parseInt(row) - 1, channel: parseInt(channel) });
		} else if (e.code === "ArrowDown") {
			focusNoteSelector({ row: parseInt(row) + 1, channel: parseInt(channel) });
		}
	}

	function handleClick(e: MouseEvent) {
		// activeNoteElementId.value = (<HTMLButtonElement>e.target).id;
	}
</script>

<button
	{id}
	data-hex={hex}
	onkeydown={handleKeyPress}
	onclick={handleClick}
	class:text-lg={selectedNote !== "---"}
	class:items-center={selectedNote !== "---"}
	class="focus:ring-none focus-visible:ring-none focus:bg-selection-500 relative flex h-5 w-9 justify-center border-none p-0 text-3xl text-white focus:text-black focus:outline-transparent focus-visible:border-none focus-visible:outline-none">
	<span class:leading-={selectedNote !== "---"} class="pointer-events-none leading-3">
		{@html DOMPurify.sanitize(addSpace(selectedNote))}
	</span>
</button>

<style>
</style>
