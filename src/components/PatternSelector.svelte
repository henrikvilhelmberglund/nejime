<script lang="ts">
	import { onMount } from "svelte";
	import { dPressed, fPressed, lastChannelPattern, lastPatternHex, lastRowPattern, lastTouchedPattern, sPressed } from "./globalState.svelte";
	import { add, edit, remove } from "./editing.svelte";

	let {
		id,
		hex,
		channel,
		selectedPattern
	}: { id: string; hex: string; channel: string; selectedPattern: string } = $props();
	// let name = $state("--");

	// let el = document.getElementById("div-1").nextSibling;

	function focusPatternSelector({ row, channel }: { row: number; channel: number }) {
		try {
			const patternSelector: HTMLButtonElement = document.querySelector(
				`#row${row}-channel${+channel}`
			)!;
			patternSelector.focus();
			lastPatternHex.value = (<HTMLButtonElement>document.activeElement)!.innerText;
			lastRowPattern.value = row;
			lastChannelPattern.value = channel;
		} catch (error) {
			console.error(`element ${`#row${row}-channel${+channel}`} not found, can't focus`);
		}
	}

	function handleKeyPress(e: KeyboardEvent) {
		const row = id.split("row")[1].split("-channel")[0];
		const channel = id.split("row")[1].split("-channel")[1];
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
			focusPatternSelector({ row: parseInt(row), channel: parseInt(channel) - 1 });
		} else if (e.code === "ArrowRight") {
			focusPatternSelector({ row: parseInt(row), channel: parseInt(channel) + 1 });
		} else if (e.code === "ArrowUp") {
			focusPatternSelector({ row: parseInt(row) - 1, channel: parseInt(channel) });
		} else if (e.code === "ArrowDown") {
			focusPatternSelector({ row: parseInt(row) + 1, channel: parseInt(channel) });
		}
	}
</script>

<button
	{id}
	data-hex={hex}
	onkeydown={handleKeyPress}
	class:text-lg={selectedPattern !== "--"}
	class:items-center={selectedPattern !== "--"}
	class="focus:ring-none focus-visible:ring-none focus:bg-selection-500 relative flex h-5 w-6 justify-center border-none p-0 text-3xl text-white focus:text-black focus:outline-transparent focus-visible:border-none focus-visible:outline-none">
	<span class:leading-={selectedPattern !== "--"} class="pointer-events-none leading-3">
		{selectedPattern}
	</span>
</button>

<style>
</style>
