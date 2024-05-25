<script lang="ts">
	import { add, edit, remove } from "./editing.svelte";
	import { dPressed, fPressed, lastPhraseHex, lastRowPhrase, lastTouchedPhrase, sPressed } from "./globalState.svelte";

	let { id, hex, selectedPhrase }: { id: string; hex: string; selectedPhrase: string } = $props();

	function focusPhraseSelector({ row }: { row: number }) {
		try {
			const phraseSelector: HTMLButtonElement = document.querySelector(`#row${row}-pattern`)!;
			phraseSelector.focus();
      lastPhraseHex.value = (<HTMLButtonElement>document.activeElement)!.innerText;
			lastRowPhrase.value = row;
		} catch (error) {
			console.error(`element ${`#row${row}-pattern`} not found, can't focus`);
		}
	}

	function focusTransposeSelector({ row }: { row: number }) {
		try {
			const phraseSelector: HTMLButtonElement = document.querySelector(`#row${row}-transpose`)!;
			phraseSelector.focus();
			lastRowPhrase.value = row;
		} catch (error) {
			console.error(`element ${`#row${row}-pattern`} not found, can't focus`);
		}
	}

	function handleKeyPress(e: KeyboardEvent) {
		const row = id.split("row")[1].split("-channel")[0];
		e.preventDefault();

		// * add+preview
		if (!dPressed.value && e.code === "KeyF") {
			if ((<HTMLButtonElement>document.activeElement).innerText === "--") {
				add({ element: <HTMLButtonElement>document.activeElement });
			} else {
				lastTouchedPhrase.value = (<HTMLButtonElement>document.activeElement).innerText;
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
			console.log("pressed phrase");
			if (e.code === "ArrowLeft") {
				edit({ direction: "left", element: <HTMLButtonElement>document.activeElement });
			} else if (e.code === "ArrowRight") {
				edit({ direction: "right", element: <HTMLButtonElement>document.activeElement });
			} else if (e.code === "ArrowUp") {
				edit({ direction: "up", element: <HTMLButtonElement>document.activeElement });
			} else if (e.code === "ArrowDown") {
				edit({ direction: "down", element: <HTMLButtonElement>document.activeElement });
			}
		}
		// * cursor movement
		else if (e.code === "ArrowLeft") {
			// focusTransposeSelector({ row: parseInt(row)});
		} else if (e.code === "ArrowRight") {
			focusTransposeSelector({ row: parseInt(row) });
		} else if (e.code === "ArrowUp") {
			focusPhraseSelector({ row: parseInt(row) - 1 });
		} else if (e.code === "ArrowDown") {
			focusPhraseSelector({ row: parseInt(row) + 1 });
		}
	}
</script>

<button
	{id}
	onkeydown={handleKeyPress}
	class:text-lg={selectedPhrase !== "--"}
	class:items-center={selectedPhrase !== "--"}
	class="focus:ring-none focus-visible:ring-none focus:bg-selection-500 relative flex h-5 w-6 border-none p-0 text-3xl text-white focus:text-black focus:outline-transparent focus-visible:border-none focus-visible:outline-none">
	<span class="pointer-events-none leading-3">
		{selectedPhrase}
	</span></button>

<style>
</style>
