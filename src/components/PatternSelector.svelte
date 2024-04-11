<script lang="ts">
	import { createActivePatternElementId, createSPressedState } from "./globalState.svelte";

	let name = $state("--");
	let { id }: { id: string } = $props();
	let activePatternElementId = createActivePatternElementId();
	let sPressed = createSPressedState();

	// let el = document.getElementById("div-1").nextSibling;

	function focusPatternSelector({ row, channel }: { row: number; channel: number }) {
		try {
			const patternSelector: HTMLButtonElement = document.querySelector(
				`#row-${row}-channel-${+channel}`
			)!;
			patternSelector.focus();
			activePatternElementId.value = patternSelector.id;
		} catch (error) {
			console.error(`element ${`#row-${row}-channel-${+channel}`} not found, can't focus`);
		}
	}

	function handleKeyPress(e: KeyboardEvent) {
		const row = id.split("row-")[1].split("-channel")[0];
		const channel = id.split("row-")[1].split("-channel-")[1];
		e.preventDefault();
		if (sPressed.value) return;
		if (e.code === "ArrowLeft") {
			focusPatternSelector({ row: parseInt(row), channel: parseInt(channel) - 1 });
		} else if (e.code === "ArrowRight") {
			focusPatternSelector({ row: parseInt(row), channel: parseInt(channel) + 1 });
		} else if (e.code === "ArrowUp") {
			focusPatternSelector({ row: parseInt(row) - 1, channel: parseInt(channel) });
		} else if (e.code === "ArrowDown") {
			focusPatternSelector({ row: parseInt(row) + 1, channel: parseInt(channel) });
		}
	}

	function handleClick(e: MouseEvent) {
		activePatternElementId.value = (<HTMLButtonElement>e.target).id;
	}

	$effect(() => {
		if (activePatternElementId && activePatternElementId.value) {
			document
				.querySelector<HTMLButtonElement>(`#nejime #${activePatternElementId.value}`)!
				.focus();
		} else {
			document.querySelector<HTMLButtonElement>("#nejime button")!.focus();
		}
	});
</script>

<button
	{id}
	onkeydown={handleKeyPress}
	onclick={handleClick}
	class="focus:ring-none focus-visible:ring-none flex h-6 w-6 items-center justify-center border-none p-0 text-center text-2xl focus:bg-blue-500 focus:outline-transparent focus-visible:border-none focus-visible:outline-none"
	>{name}</button>

<style>
</style>
