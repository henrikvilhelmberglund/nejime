<script>
	import { themeColors } from "./theme";

  // TODO check localstorage for saved value
	let selectedTheme = $state("blue");

	$effect(() => {
		if (selectedTheme) {
			themeColors.forEach((theme) => {
				document.documentElement.classList.remove(theme);
			});
			document.documentElement.classList.add(selectedTheme);
		}
	});
</script>

<div class="flex flex-col absolute -top-40 left-44">
	{#each themeColors as themeColor}
		<button
			onclick={() => (selectedTheme = themeColor)}
			class="mx-2 h-10 w-16 rounded p-2 text-transparent bg-{themeColor}-500"></button>
	{/each}
</div>

<style>
</style>
