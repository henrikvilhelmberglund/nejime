<script lang="ts">
	import { add, edit, preview, remove, stopNotePreview } from "./editing.svelte";
	import {
		instruments,
		dPressed,
		fPressed,
		lastChannelNote,
		lastRowNote,
		lastTouchedInstrument,
		lastTouchedNote,
		sPressed,
		shouldPreview,
		lastRowPhrase,
		lastPhraseHex,
		phrases,
		patterns,
		lastPatternHex
	} from "./globalState.svelte";
	import { addSpace, toHex } from "./utils";
	import DOMPurify from "isomorphic-dompurify";

	let {
		id,
		hex,
		selectedNote
	}: { id: string; hex: string; channel: string; selectedNote: string } = $props();

	function focusNoteSelector({ row, channel }: { row: number; channel: number }) {
		try {
			const noteSelector: HTMLButtonElement = document.querySelector(
				`#note${row}-channel${+channel}`
			)!;
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
			instrumentSelector.focus();
		} catch (error) {
			console.error(`element ${`#note${row}-channel${+channel}`} not found, can't focus`);
		}
	}

	function handleKeyPress(e: KeyboardEvent) {
		const row = id.split("note")[1].split("-channel")[0];
		const channel = id.split("note")[1].split("-channel")[1];
		const instrumentSelectorOnRow = <HTMLButtonElement>(
			document.querySelector(`#instrument-selector${row}`)!
		);
		const instrumentOnRow = instrumentSelectorOnRow.innerText;

		e.preventDefault();
		// preview note when key is not movement
		// * add+preview
		if (!dPressed.value && e.code === "KeyF") {
			if ((<HTMLButtonElement>document.activeElement).innerText === "---") {
				add({ element: <HTMLButtonElement>document.activeElement });
				shouldPreview.value = true;
			} else {
				lastTouchedInstrument.value = instrumentOnRow;
				lastTouchedNote.value = (<HTMLButtonElement>document.activeElement).innerText.replaceAll(
					// ! this is probably stupid but it works (C  3 turns into C3 etc)
					" ",
					""
				);
				// console.info("lastTouchedNote", lastTouchedNote.value);
				shouldPreview.value = true;
			}
		} else {
			shouldPreview.value = false;
		}

		// * remove
		if (dPressed.value && e.code === "KeyF") {
			// console.log("remove");
			if ((<HTMLButtonElement>document.activeElement).innerText !== "---") {
				remove({ element: <HTMLButtonElement>document.activeElement });
			}
		}

		// if s or d are pressed, don't use below logic that switches cursor location
		if (sPressed.value || dPressed.value) return;

		// * preview
		if (!e.repeat && instruments.value) {
			if (shouldPreview.value) {
				preview({
					element: <HTMLButtonElement>document.activeElement,
					instrument:
						instruments.value[instrumentOnRow] ?? instruments.value[lastTouchedInstrument.value]
				});
			}
		}

		// * edit
		if (fPressed.value && instruments.value) {
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
					instrument: instruments.value[instrument]
				});
				edit({ direction: direction, element: <HTMLButtonElement>document.activeElement });
				preview({
					element: <HTMLButtonElement>document.activeElement,
					instrument: instruments.value[instrument]
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
			if (parseInt(row) === 0) {
				// phrase exists above
				if (patterns.value[lastPatternHex.value][toHex(lastRowPhrase.value - 1)]) {
					lastPhraseHex.value =
						patterns.value[lastPatternHex.value][toHex(lastRowPhrase.value - 1)];
					lastRowPhrase.value -= 1;
					focusNoteSelector({ row: 15, channel: parseInt(channel) });
				}
			} else {
				focusNoteSelector({ row: parseInt(row) - 1, channel: parseInt(channel) });
			}
		} else if (e.code === "ArrowDown") {
			if (parseInt(row) === 15) {
				// phrase exists below
				if (patterns.value[lastPatternHex.value][toHex(lastRowPhrase.value + 1)]) {
					lastPhraseHex.value =
						patterns.value[lastPatternHex.value][toHex(lastRowPhrase.value + 1)];
					lastRowPhrase.value += 1;
					focusNoteSelector({ row: 0, channel: parseInt(channel) });
				}
			} else {
				focusNoteSelector({ row: parseInt(row) + 1, channel: parseInt(channel) });
			}
		}
	}

	function handleKeyUp(e: KeyboardEvent) {
		shouldPreview.value = false;
		const row = id.split("note")[1].split("-channel")[0];
		const channel = id.split("note")[1].split("-channel")[1];
		const instrument = (<HTMLButtonElement>document.querySelector(`#instrument-selector${row}`))!
			.innerText;

		if (e.code === "KeyF" && instruments.value) {
			stopNotePreview({
				element: <HTMLButtonElement>document.activeElement,
				instrument: instruments.value[instrument]
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
