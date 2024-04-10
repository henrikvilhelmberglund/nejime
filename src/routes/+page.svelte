<script lang="ts">
	import DarkModeToggle from "$lib/theme/DarkModeToggle.svelte";
	import ThemeSwitcher from "$lib/theme/ThemeSwitcher.svelte";
	import Button from "../components/Button.svelte";
	import Pattern from "../components/Pattern.svelte";
	import Phrase from "../components/Phrase.svelte";
	import Song from "../components/Song.svelte";

	let activeState = $state("song");
</script>

<div class="p-2">
	<ThemeSwitcher />
	<DarkModeToggle />
	<Button
		onclick={() => {
			alert("This is an alert");
		}}>Alert</Button>
	<main class="flex items-center">
		{#if activeState === "song"}
			<Song />
		{:else if activeState === "pattern"}
			<Pattern />
		{:else if activeState === "phrase"}
			<Phrase />
		{/if}
	</main>
</div>
