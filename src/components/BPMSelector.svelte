<script lang="ts">
	import { add, edit, remove } from "./editing.svelte";
	import {
		createSPressedState,
		createDPressedState,
		createFPressedState,
		createBpmState
	} from "./globalState.svelte";

	let { id }: { id: string } = $props();

	let sPressed = createSPressedState();
	let dPressed = createDPressedState();
	let fPressed = createFPressedState();
	let bpm = createBpmState();

	// let el = document.getElementById("div-1").nextSibling;

	function focusPhraseSelector({ row }: { row: number }) {
		try {
			const BPMSelector: HTMLButtonElement = document.querySelector(`#bpm-selector`)!;
			BPMSelector.focus();
		} catch (error) {
			console.error(`element ${`#bpm-selector`} not found, can't focus`);
		}
	}

	function handleKeyPress(e: KeyboardEvent) {
		// const channel = id.split("row-")[1].split("-channel-")[1];
		e.preventDefault();

		// if s or d are pressed, don't use below logic that switches cursor location
		if (sPressed.value || dPressed.value) return;
		// * edit
		if (fPressed.value) {
			// preview({ element: <HTMLButtonElement>document.activeElement });
			console.log("pressed phrase");
			if (e.code === "ArrowLeft") {
				bpm.value -= 1;
			} else if (e.code === "ArrowRight") {
				bpm.value += 1;
			} else if (e.code === "ArrowUp") {
				bpm.value += 10;
			} else if (e.code === "ArrowDown") {
				bpm.value -= 10;
			}
		}
		// * cursor movement
		// TODO select other options if available
		else if (e.code === "ArrowLeft") {
		} else if (e.code === "ArrowRight") {
		} else if (e.code === "ArrowUp") {
		} else if (e.code === "ArrowDown") {
		}
	}

	function handleClick(e: MouseEvent) {
		// activePhraseElementId.value = (<HTMLButtonElement>e.target).id;
	}

	$effect(() => {
		const BPMSelector = document.querySelector<HTMLButtonElement>("#nejime button")!;
		queueMicrotask(() => {
			BPMSelector.focus();
		});
	});
</script>

<button
	{id}
	onkeydown={handleKeyPress}
	onclick={handleClick}
	class="focus:ring-none focus-visible:ring-none focus:bg-selection-500 relative flex h-5 w-7 items-center border-none p-0 text-lg text-white focus:text-black focus:outline-transparent focus-visible:border-none focus-visible:outline-none">
	<span class="pointer-events-none leading-3">
		{bpm.value}
	</span></button>

<style>
</style>
