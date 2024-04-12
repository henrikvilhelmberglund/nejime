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
		createActiveScreenState
	} from "./globalState.svelte";

	let allStates = ["song", "pattern", "phrase", "instrument", "project-song", "project-pattern"];
	let activeScreenState = createActiveScreenState();

	let sPressed = createSPressedState();
	let dPressed = createDPressedState();
	let fPressed = createFPressedState();

	function changeState(direction: string) {
		if (activeScreenState.value === "song" && direction === "right") {
			activeScreenState.value = "pattern";
		} else if (activeScreenState.value === "pattern" && direction === "left") {
			activeScreenState.value = "song";
		} else if (activeScreenState.value === "pattern" && direction === "right") {
			activeScreenState.value = "phrase";
		} else if (activeScreenState.value === "pattern" && direction === "right") {
			activeScreenState.value = "phrase";
		} else if (activeScreenState.value === "song" && direction === "up") {
			activeScreenState.value = "project-song";
		} else if (activeScreenState.value === "pattern" && direction === "up") {
			activeScreenState.value = "project-pattern";
		} else if (activeScreenState.value === "project-song" && direction === "down") {
			activeScreenState.value = "song";
		} else if (activeScreenState.value === "project-pattern" && direction === "down") {
			activeScreenState.value = "pattern";
		}
	}
</script>

<div
	id="nejime"
	role="presentation"
	onkeydown={(e) => {
		console.log(e);
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
	}}
	onkeyup={(e) => {
		console.log(e);
		if (e.code === "KeyS") {
			sPressed.value = false;
		}
	}}
	class="h-[500px] w-[500px] rounded-lg border-black border-2 bg-primary-400 flex flex-col text-black dark:text-white">
  <p class="text-lg text-white font-semibold pl-1">{activeScreenState.value.toUpperCase()}</p>
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
