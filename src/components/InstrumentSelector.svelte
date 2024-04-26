<script lang="ts">
	import {
		createSPressedState,
		createDPressedState,
		createFPressedState,
		createLastRowPatternState,
		createLastChannelPatternState,
		createLastTouchedPatternState,
		createLastRowNoteState,
		createLastChannelNoteState
	} from "./globalState.svelte";
	import { add, edit, remove } from "./editing.svelte";

	let { id, hex, selectedInstrument }: { id: string; hex: string; selectedInstrument: string } =
		$props();
	// let name = $state("--");
	let sPressed = createSPressedState();
	let dPressed = createDPressedState();
	let fPressed = createFPressedState();
	let lastRowNote = createLastRowNoteState();
	let lastChannelNote = createLastChannelNoteState();
	// let lastRowPattern = createLastRowPatternState();
	let lastChannelPattern = createLastChannelPatternState();
	let lastTouchedPattern = createLastTouchedPatternState();

	// let el = document.getElementById("div-1").nextSibling;

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

	function focusInstrumentSelector({ row, channel }: { row: number; channel: number }) {
		try {
			const instrumentSelector: HTMLButtonElement = document.querySelector(
				`#row${row}-channel${+channel}`
			)!;
			instrumentSelector.focus();
			// lastRowPattern.value = row;
			lastChannelPattern.value = channel;
		} catch (error) {
			console.error(`element ${`#row${row}-channel${+channel}`} not found, can't focus`);
		}
	}

	function handleKeyPress(e: KeyboardEvent) {
		const row = id.split("instrument-selector")[1];
		// const channel = id.split("row")[1].split("-channel")[1];
		e.preventDefault();

		// * add+preview
		if (!dPressed.value && e.code === "KeyF") {
			if ((<HTMLButtonElement>document.activeElement).innerText === "--") {
				add({ element: <HTMLButtonElement>document.activeElement });
			} else {
				lastTouchedPattern.value = (<HTMLButtonElement>document.activeElement).innerText;
			}
		}

		// * remove
		if (dPressed.value && e.code === "KeyF") {
			console.log("remove");
			if ((<HTMLButtonElement>document.activeElement).innerText !== "--") {
				remove({ element: <HTMLButtonElement>document.activeElement });
			}
		}

		// if s or d are pressed, don't use below logic that switches cursor location
		if (sPressed.value || dPressed.value) return;
		// * edit
		if (fPressed.value) {
			// preview({ element: <HTMLButtonElement>document.activeElement });
			console.log("pressed pattern");
			if (e.code === "ArrowLeft") {
				edit({ direction: "left", element: <HTMLButtonElement>document.activeElement });
			} else if (e.code === "ArrowRight") {
				edit({ direction: "right", element: <HTMLButtonElement>document.activeElement });
			} else if (e.code === "ArrowUp") {
				edit({ direction: "up", element: <HTMLButtonElement>document.activeElement });
			} else if (e.code === "ArrowDown") {
				edit({ direction: "down", element: <HTMLButtonElement>document.activeElement });
			}
		} else if (e.code === "ArrowLeft") {
			focusNoteSelector({ row: parseInt(row), channel: 5 });
		} else if (e.code === "ArrowRight") {
			focusNoteSelector({ row: parseInt(row), channel: 1 });
		} else if (e.code === "ArrowUp") {
			focusInstrumentSelector({ row: parseInt(row) - 1 });
		} else if (e.code === "ArrowDown") {
			focusInstrumentSelector({ row: parseInt(row) + 1 });
		}
	}

	function handleClick(e: MouseEvent) {
		// activePatternElementId.value = (<HTMLButtonElement>e.target).id;
	}
</script>

<button
	{id}
	data-hex={hex}
	onkeydown={handleKeyPress}
	onclick={handleClick}
	class:text-lg={selectedInstrument !== "--"}
	class:items-center={selectedInstrument !== "--"}
	class="focus:ring-none focus-visible:ring-none focus:bg-selection-500 relative flex h-5 w-6 justify-center border-none p-0 text-3xl text-white focus:text-black focus:outline-transparent focus-visible:border-none focus-visible:outline-none">
	<span class:leading-={selectedInstrument !== "--"} class="pointer-events-none leading-3">
		{selectedInstrument}
	</span>
</button>

<style>
</style>
