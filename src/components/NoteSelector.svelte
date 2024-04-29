<script lang="ts">
	import { add, edit, preview, remove, stopNotePreview } from "./editing.svelte";
	import {
		createSPressedState,
		createDPressedState,
		createFPressedState,
		createLastRowNoteState,
		createLastChannelNoteState,
		createShouldPreviewState,
		createLastTouchedNoteState,
		createInstrumentsState
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
	let lastTouchedNote = createLastTouchedNoteState();
	let shouldPreview = createShouldPreviewState();
	let soundfonts = createInstrumentsState();

	function focusNoteSelector({ row, channel }: { row: number; channel: number }) {
		try {
			const noteSelector: HTMLButtonElement = document.querySelector(
				`#note${row}-channel${+channel}`
			)!;
			console.log("noteSelector", noteSelector);
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

		// TODO add instrument field
		// const instrument = 53;
		const instrument = (<HTMLButtonElement>document.querySelector(`#instrument-selector${row}`))!
			.innerText;

		e.preventDefault();
		// preview note when key is not movement
		// * add+preview
		if (!dPressed.value && e.code === "KeyF") {
			if ((<HTMLButtonElement>document.activeElement).innerText === "---") {
				add({ element: <HTMLButtonElement>document.activeElement });
				shouldPreview.value = true;
			} else {
				lastTouchedNote.value = (<HTMLButtonElement>document.activeElement).innerText.replaceAll(
					// ! this is probably stupid but it works (C  3 turns into C3 etc)
					" ",
					""
				);
				console.info("lastTouchedNote", lastTouchedNote.value);
				shouldPreview.value = true;
			}
		} else {
			shouldPreview.value = false;
		}

		// * remove
		if (dPressed.value && e.code === "KeyF") {
			console.log("remove");
			if ((<HTMLButtonElement>document.activeElement).innerText !== "---") {
				remove({ element: <HTMLButtonElement>document.activeElement });
			}
		}

		// if s or d are pressed, don't use below logic that switches cursor location
		if (sPressed.value || dPressed.value) return;
		if (!fPressed.value) {
			// * preview
			if (shouldPreview.value) {
				// stopNotePreview({
				// 	element: <HTMLButtonElement>document.activeElement,
				// 	instrument: soundfonts.value[instrument]
				// });
				preview({
					element: <HTMLButtonElement>document.activeElement,
					instrument: soundfonts.value[instrument]
				});
			}
		}
		// * edit
		if (fPressed.value) {
			// preview({ element: <HTMLButtonElement>document.activeElement });
			console.log("pressed");
			shouldPreview.value = true;
			if (e.code === "ArrowLeft") {
				stopNotePreview({
					element: <HTMLButtonElement>document.activeElement,
					instrument: soundfonts.value[instrument]
				});
				edit({ direction: "left", element: <HTMLButtonElement>document.activeElement });
				preview({
					element: <HTMLButtonElement>document.activeElement,
					instrument: soundfonts.value[instrument]
				});
			} else if (e.code === "ArrowRight") {
				stopNotePreview({
					element: <HTMLButtonElement>document.activeElement,
					instrument: soundfonts.value[instrument]
				});
				edit({ direction: "right", element: <HTMLButtonElement>document.activeElement });
				preview({
					element: <HTMLButtonElement>document.activeElement,
					instrument: soundfonts.value[instrument]
				});
			} else if (e.code === "ArrowUp") {
				stopNotePreview({
					element: <HTMLButtonElement>document.activeElement,
					instrument: soundfonts.value[instrument]
				});
				edit({ direction: "up", element: <HTMLButtonElement>document.activeElement });
				preview({
					element: <HTMLButtonElement>document.activeElement,
					instrument: soundfonts.value[instrument]
				});
			} else if (e.code === "ArrowDown") {
				stopNotePreview({
					element: <HTMLButtonElement>document.activeElement,
					instrument: soundfonts.value[instrument]
				});
				edit({ direction: "down", element: <HTMLButtonElement>document.activeElement });
				preview({
					element: <HTMLButtonElement>document.activeElement,
					instrument: soundfonts.value[instrument]
				});
			}
		}
		// * cursor movement
		else if (e.code === "ArrowLeft") {
			focusNoteSelector({ row: parseInt(row), channel: parseInt(channel) - 1 });
		} else if (e.code === "ArrowRight") {
			focusNoteSelector({ row: parseInt(row), channel: parseInt(channel) + 1 });
		} else if (e.code === "ArrowUp") {
			focusNoteSelector({ row: parseInt(row) - 1, channel: parseInt(channel) });
		} else if (e.code === "ArrowDown") {
			focusNoteSelector({ row: parseInt(row) + 1, channel: parseInt(channel) });
		}
	}

	function handleKeyUp(e: KeyboardEvent) {
		shouldPreview.value = false;
		const row = id.split("note")[1].split("-channel")[0];
		const channel = id.split("note")[1].split("-channel")[1];
		const instrument = (<HTMLButtonElement>document.querySelector(`#instrument-selector${row}`))!
			.innerText;

		if (e.code === "KeyF") {
			stopNotePreview({
				element: <HTMLButtonElement>document.activeElement,
				instrument: soundfonts.value[instrument]
			});
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
	onkeyup={handleKeyUp}
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
