<script lang="ts">
	import DarkModeToggle from "$lib/theme/DarkModeToggle.svelte";
	import ThemeSwitcher from "$lib/theme/ThemeSwitcher.svelte";
	import Instrument from "./Instrument.svelte";
	import Pattern from "./Pattern.svelte";
	import Phrase from "./Phrase.svelte";
	import Project from "./Project.svelte";
	import Song from "./Song.svelte";
	import {
		createSPressedState,
		createDPressedState,
		createFPressedState,
		createActiveScreenState,
		createIsPlayingBackState,
		createIntervalIdState,
		createBpmState,
		createPhraseLoopIntervalIdState,
		createPlayPositionState,

		createLastPhraseHexState

	} from "./globalState.svelte";
	import { play, stop } from "./utils";

	let allStates = ["song", "pattern", "phrase", "instrument", "project-song", "project-pattern"];
	let activeScreenState = createActiveScreenState();

	let sPressed = createSPressedState();
	let dPressed = createDPressedState();
	let fPressed = createFPressedState();
	let isPlayingBack = createIsPlayingBackState();
	let bpmState = createBpmState();

	function changeState(direction: string) {
		let activeElement = <HTMLButtonElement>document.activeElement!;
		if (activeScreenState.value === "song" && direction === "right") {
			if (activeElement.innerText === "--") return;
			activeScreenState.value = "pattern";
		} else if (activeScreenState.value === "pattern" && direction === "left") {
			activeScreenState.value = "song";
		} else if (activeScreenState.value === "pattern" && direction === "right") {
			if (activeElement.innerText === "--") return;
			activeScreenState.value = "phrase";
		} else if (activeScreenState.value === "song" && direction === "up") {
			activeScreenState.value = "project-song";
		} else if (activeScreenState.value === "pattern" && direction === "up") {
			activeScreenState.value = "project-pattern";
		} else if (activeScreenState.value === "project-song" && direction === "down") {
			activeScreenState.value = "song";
		} else if (activeScreenState.value === "project-pattern" && direction === "down") {
			activeScreenState.value = "pattern";
		} else if (activeScreenState.value === "phrase" && direction === "left") {
			activeScreenState.value = "pattern";
		}
	}
	const intervalIdState = createIntervalIdState();
	const phraseLoopIntervalIdState = createPhraseLoopIntervalIdState();
	const playPositionState = createPlayPositionState();
  let lastPhraseHex = createLastPhraseHexState();
</script>

<div
	id="nejime"
	role="presentation"
	onkeydown={(e) => {
		// console.log(e);
		if (e.code === "KeyS") {
			sPressed.value = true;
		}
		if (e.code === "KeyD") {
			dPressed.value = true;
		}
		if (e.code === "KeyF") {
			fPressed.value = true;
		}
		if (sPressed.value && e.code === "ArrowRight") {
			changeState("right");
		}
		if (sPressed.value && e.code === "ArrowLeft") {
			changeState("left");
		}
		if (sPressed.value && e.code === "ArrowUp") {
			changeState("up");
		}
		if (sPressed.value && e.code === "ArrowDown") {
			changeState("down");
		}
		if (e.code === "Space") {
			if (!isPlayingBack.value) {
				if (activeScreenState.value === "phrase") {
					play(activeScreenState.value, lastPhraseHex.value);
					// after first play, start looping
					phraseLoopIntervalIdState.value = setInterval(
						() => {
							play(activeScreenState.value, lastPhraseHex.value);
						},
						1000 * 17 * (60 / (bpmState.value * 4))
					);
					intervalIdState.value = setInterval(
						() => {
							if (playPositionState.value < 16) {
								playPositionState.value += 1;
							} else {
								playPositionState.value = 0;
							}
						},
						1000 * (60 / (bpmState.value * 4))
					);
				}
				isPlayingBack.value = true;
			} else {
				stop(activeScreenState.value);
				isPlayingBack.value = false;
				intervalIdState.stop();
				phraseLoopIntervalIdState.stop();
			}
		}
	}}
	onkeyup={(e) => {
		// console.log(e);
		if (e.code === "KeyS") {
			sPressed.value = false;
		}
		if (e.code === "KeyD") {
			dPressed.value = false;
		}
		if (e.code === "KeyF") {
			fPressed.value = false;
		}
	}}
	class="bg-primary-400 flex h-[500px] w-[500px] flex-col rounded-lg border-2 border-black text-black dark:text-white">
	{#if activeScreenState.value === "song"}
		<Song />
	{:else if activeScreenState.value === "pattern"}
		<Pattern />
	{:else if activeScreenState.value === "phrase"}
		<Phrase />
	{:else if activeScreenState.value === "instrument"}
		<Instrument />
	{:else if activeScreenState.value === "project"}
		<Project />
	{/if}
</div>

<style>
</style>
