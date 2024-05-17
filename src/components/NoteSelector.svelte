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
		createInstrumentsState,
		createLastTouchedInstrumentState
	} from "./globalState.svelte";
	import { addSpace } from "./utils";
	import DOMPurify from "isomorphic-dompurify";

	let {
		id,
		hex,
		selectedNote
	}: { id: string; hex: string; channel: string; selectedNote: string } = $props();
	let sPressed = createSPressedState();
	let dPressed = createDPressedState();
	let fPressed = createFPressedState();
	let lastRowNote = createLastRowNoteState();
	let lastChannelNote = createLastChannelNoteState();
	let lastTouchedNote = createLastTouchedNoteState();
	let lastTouchedInstrument = createLastTouchedInstrumentState();
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
		} catch (error) {
			console.error(`element ${`#note${row}-channel${+channel}`} not found, can't focus`);
		}
	}

	function focusInstrumentSelector({ row, channel }: { row: number; channel: number }) {
		try {
			const instrumentSelector: HTMLButtonElement = document.querySelector(
				`#instrument-selector${row}`
			)!;
			console.log("instrumentSelector", instrumentSelector);
			instrumentSelector.focus();
		} catch (error) {
			console.error(`element ${`#note${row}-channel${+channel}`} not found, can't focus`);
		}
	}

	function handleKeyPress(e: KeyboardEvent) {
		const row = id.split("note")[1].split("-channel")[0];
		const channel = id.split("note")[1].split("-channel")[1];

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

    // * preview
		if (!fPressed.value && soundfonts.value) {
			if (shouldPreview.value) {
        const rowNumber = document.activeElement!.id.split("note")[1].split("-")[0];
        const instrumentSelectorOnRow = <HTMLButtonElement>document.querySelector(`#instrument-selector${rowNumber}`)!;
        const instrumentOnRow = instrumentSelectorOnRow.innerText;
				preview({
					element: <HTMLButtonElement>document.activeElement,
					instrument: soundfonts.value[instrumentOnRow] ?? soundfonts.value[lastTouchedInstrument.value]
				});
			}
		}

    // * edit
		if (fPressed.value && soundfonts.value) {
			shouldPreview.value = true;
			const instrument = (<HTMLButtonElement>document.querySelector(`#instrument-selector${row}`))!
				.innerText;

			if (
				e.code === "ArrowLeft" ||
				e.code === "ArrowRight" ||
				e.code === "ArrowUp" ||
				e.code === "ArrowDown"
			) {
				const direction = e.code.split("Arrow")[1].toLowerCase();
				stopNotePreview({
					element: <HTMLButtonElement>document.activeElement,
					instrument: soundfonts.value[instrument]
				});
				edit({ direction: direction, element: <HTMLButtonElement>document.activeElement });
				preview({
					element: <HTMLButtonElement>document.activeElement,
					instrument: soundfonts.value[instrument]
				});
			}
		}

		// * cursor movement
		else if (e.code === "ArrowLeft") {
			if (parseInt(channel) === 0) {
				focusInstrumentSelector({ row: parseInt(row), channel: parseInt(channel) + 1 });
			} else {
				focusNoteSelector({ row: parseInt(row), channel: parseInt(channel) - 1 });
			}
		} else if (e.code === "ArrowRight") {
			if (parseInt(channel) === 4) {
				focusInstrumentSelector({ row: parseInt(row), channel: parseInt(channel) + 1 });
			} else {
				focusNoteSelector({ row: parseInt(row), channel: parseInt(channel) + 1 });
			}
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

		if (e.code === "KeyF" && soundfonts.value) {
			stopNotePreview({
				element: <HTMLButtonElement>document.activeElement,
				instrument: soundfonts.value[instrument]
			});
		}
	}

</script>

<button
	{id}
	data-hex={hex}
	onkeydown={handleKeyPress}
	onkeyup={handleKeyUp}
	class:text-lg={selectedNote !== "---"}
	class:items-center={selectedNote !== "---"}
	class="focus:ring-none focus-visible:ring-none focus:bg-selection-500 relative flex h-5 w-9 justify-center border-none p-0 text-3xl text-white focus:text-black focus:outline-transparent focus-visible:border-none focus-visible:outline-none">
	<span class:leading-={selectedNote !== "---"} class="pointer-events-none leading-3">
		{@html DOMPurify.sanitize(addSpace(selectedNote))}
	</span>
</button>

<style>
</style>
