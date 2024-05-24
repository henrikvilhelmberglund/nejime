<script lang="ts">
	import { Soundfont } from "smplr";
	import {
		createActiveScreenState,
		createContextState,
		createDPressedState,
		createFPressedState,
		createInstrumentsState,
		createOpenedInstrumentState,
		createSPressedState,
		instrumentNames
	} from "./globalState.svelte";
	import { toHex, toInt } from "./utils";

	let activeScreenState = createActiveScreenState();
	let openedInstrument = createOpenedInstrumentState();
	let instruments = createInstrumentsState();

	let sPressed = createSPressedState();
	let dPressed = createDPressedState();
	let fPressed = createFPressedState();

	let context = createContextState();

	let instrumentHex = $state(instruments.value[openedInstrument.value].hex);

	function handleKeyPress(e: KeyboardEvent) {
		// const channel = id.split("row-")[1].split("-channel-")[1];
		e.preventDefault();

		// if s or d are pressed, don't use below logic that switches cursor location
		if (sPressed.value || dPressed.value) return;
		// * edit
		if (fPressed.value && instruments.value && context.value) {
			// preview({ element: <HTMLButtonElement>document.activeElement });
			console.log("pressed phrase");
			if (e.code === "ArrowLeft") {
				if (instrumentHex === "00") {
					instrumentHex = "7F";
				} else {
					instrumentHex = toHex(toInt(instrumentHex) - 1);
				}
			} else if (e.code === "ArrowRight") {
				if (instrumentHex === "7F") {
					instrumentHex = "00";
				} else {
					instrumentHex = toHex(toInt(instrumentHex) + 1);
				}
			} else if (e.code === "ArrowUp") {
				if (toInt(instrumentHex) > 111) {
					instrumentHex = toHex(toInt(instrumentHex) - 128 + 16);
				} else {
					instrumentHex = toHex(toInt(instrumentHex) + 16);
				}
			} else if (e.code === "ArrowDown") {
				if (toInt(instrumentHex) < 16) {
					instrumentHex = toHex(toInt(instrumentHex) + 128 - 16);
				} else {
					instrumentHex = toHex(toInt(instrumentHex) - 16);
				}
			}
			instruments.value[openedInstrument.value].hex = instrumentHex;
			instruments.value[openedInstrument.value].sound = new Soundfont(context.value, {
				instrument: instrumentNames[instrumentHex]
			});
		}
		// * cursor movement
		// TODO select other options if available
		else if (e.code === "ArrowLeft") {
		} else if (e.code === "ArrowRight") {
		} else if (e.code === "ArrowUp") {
		} else if (e.code === "ArrowDown") {
		}
	}

	$effect(() => {
		const instrumentHexSelector = document.querySelector<HTMLButtonElement>("#nejime button")!;
		queueMicrotask(() => {
			instrumentHexSelector.focus();
		});
	});
</script>

<p class="pl-1 text-lg font-semibold text-white">
	{activeScreenState.value.toUpperCase()}
	{openedInstrument.value}
</p>
<main class="flex gap-2 overflow-hidden">
	{instrumentNames[instrumentHex]}
	<button
		onkeydown={handleKeyPress}
		class="focus:ring-none focus-visible:ring-none focus:bg-selection-500 relative flex h-5 w-7 items-center border-none p-0 text-lg text-white focus:text-black focus:outline-transparent focus-visible:border-none focus-visible:outline-none">
		<span class="pointer-events-none leading-3">
			{instrumentHex}
		</span></button>
</main>

<style>
</style>
