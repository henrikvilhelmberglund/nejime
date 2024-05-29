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

<style>
</style>
