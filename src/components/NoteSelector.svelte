<!-- <script lang="ts">
	import {
		createActivePatternElementIdState,
		createSPressedState,
		createDPressedState,
		createFPressedState
	} from "./globalState.svelte";

	let name = $state("--");
	let { id }: { id: string } = $props();
	let activePatternElementId = createActivePatternElementIdState();
	let sPressed = createSPressedState();
	let dPressed = createDPressedState();
	let fPressed = createFPressedState();

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
		// if s, d or f are pressed, don't use below logic that switches cursor location
		if (sPressed.value || dPressed.value || fPressed.value) return;

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
	class="focus:ring-none focus-visible:ring-none focus:bg-selection-500 relative flex h-5 w-6 border-none p-0 text-3xl text-white focus:text-black focus:outline-transparent focus-visible:border-none focus-visible:outline-none">
	<span class="pointer-events-none leading-3">
		{name}
	</span>
</button>

<style>
</style> -->
