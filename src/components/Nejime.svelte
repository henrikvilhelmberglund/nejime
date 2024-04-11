<script lang="ts">
	import DarkModeToggle from "$lib/theme/DarkModeToggle.svelte";
	import ThemeSwitcher from "$lib/theme/ThemeSwitcher.svelte";
	import Pattern from "./Pattern.svelte";
	import Phrase from "./Phrase.svelte";
	import Song from "./Song.svelte";
	import { createSPressedState } from "./globalState.svelte";

	let allStates = ["song", "patern", "phrase", "instrument"];
	let activeState = $state("song");

	let sPressed = createSPressedState();

	function changeState(direction: string) {
		if (activeState === "song" && direction === "next") {
			activeState = "pattern";
		} else if (activeState === "pattern" && direction === "previous") {
			activeState = "song";
		}
	}

	$inspect(activeState);
</script>

<ThemeSwitcher />
<DarkModeToggle />
<div
	id="nejime"
	role="presentation"
	onkeydown={(e) => {
		console.log(e);
		if (e.code === "KeyS") {
			sPressed.value = true;
		}
		if (sPressed.value && e.code === "ArrowRight") {
			changeState("next");
		}
		if (sPressed.value && e.code === "ArrowLeft") {
			changeState("previous");
		}
	}}
	onkeyup={(e) => {
		console.log(e);
		if (e.code === "KeyS") {
			sPressed.value = false;
		}
	}}
	class="bg-primary-200 dark:bg-primary-950 flex h-[600px] top-24 w-full  justify-center text-black dark:text-white">
	{#if activeState === "song"}
		<Song />
	{:else if activeState === "pattern"}
		<Pattern />
	{:else if activeState === "phrase"}
		<Phrase />
	{/if}
</div>

<style>
</style>
