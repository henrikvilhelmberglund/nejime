<script lang="ts">
	import { onMount } from "svelte";
	import { sPressed, dPressed, fPressed } from "./globalState.svelte";
	import { editTranspose, removeTranspose } from "./editing.svelte";

	let { id, hex, transpose }: { id: string; hex: string; transpose: string } = $props();

	function focusPhraseSelector({ row }: { row: number }) {
		try {
			const phraseSelector: HTMLButtonElement = document.querySelector(`#row${row}-pattern`)!;
			phraseSelector.focus();
		} catch (error) {
			console.error(`element ${`#row${row}-pattern`} not found, can't focus`);
		}
	}

	function focusTransposeSelector({ row }: { row: number }) {
		try {
			const transposeSelector: HTMLButtonElement = document.querySelector(`#row${row}-transpose`)!;
			transposeSelector.focus();
		} catch (error) {
			console.error(`element ${`#row${row}`} not found, can't focus`);
		}
	}

	function handleKeyPress(e: KeyboardEvent) {
		const row = id.split("row")[1].split("-channel")[0];
		const channel = id.split("row")[1].split("-channel")[1];
		e.preventDefault();
		// if s, d or f are pressed, don't use below logic that switches cursor location

    		// * remove
		if (dPressed.value && e.code === "KeyF") {
			// console.log("remove");
			if ((<HTMLButtonElement>document.activeElement).innerText !== "--") {
				removeTranspose({ element: <HTMLButtonElement>document.activeElement });
			}
		}

		// if s or d are pressed, don't use below logic that switches cursor location
		if (sPressed.value || dPressed.value) return;
		// * edit
		if (fPressed.value) {
			// preview({ element: <HTMLButtonElement>document.activeElement });
			if (e.code === "ArrowLeft") {
				editTranspose({ direction: "left", element: <HTMLButtonElement>document.activeElement });
			} else if (e.code === "ArrowRight") {
				editTranspose({ direction: "right", element: <HTMLButtonElement>document.activeElement });
			} else if (e.code === "ArrowUp") {
				editTranspose({ direction: "up", element: <HTMLButtonElement>document.activeElement });
			} else if (e.code === "ArrowDown") {
				editTranspose({ direction: "down", element: <HTMLButtonElement>document.activeElement });
			}
		}

		else if (e.code === "ArrowLeft") {
			focusPhraseSelector({ row: parseInt(row) });
		} else if (e.code === "ArrowRight") {
			// focusPatternSelector({ row: parseInt(row), channel: parseInt(channel) + 1 });
		} else if (e.code === "ArrowUp") {
			focusTransposeSelector({ row: parseInt(row) - 1 });
		} else if (e.code === "ArrowDown") {
			focusTransposeSelector({ row: parseInt(row) + 1 });
		}
	}

</script>

<button
	{id}
	data-hex={hex}
	onkeydown={handleKeyPress}
	class:text-lg={transpose !== "--"}
	class:items-center={transpose !== "--"}
	class="focus:ring-none focus-visible:ring-none focus:bg-selection-500 relative flex h-5 w-6 justify-center border-none p-0 text-3xl text-white focus:text-black focus:outline-transparent focus-visible:border-none focus-visible:outline-none">
	<span class:leading-={transpose !== "--"} class="pointer-events-none leading-3">
		{transpose}
	</span>
</button>

<style>
</style>
