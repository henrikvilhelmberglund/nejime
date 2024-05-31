<script>
	import { tooltip } from "$lib/actions/tooltip";
	import { onMount } from "svelte";
	let darkMode = $state();
	$effect(() => {
		darkMode = localStorage.theme === "dark" ? true : false;
	});

	function toggle() {
		darkMode = !darkMode;
		// Tailwind dark mode
		// On page load or when changing themes, best to add inline in `head` to avoid FOUC
		if (!darkMode) {
			// Whenever the user explicitly chooses light mode
			localStorage.theme = "light";
		}
		if (darkMode) {
			// Whenever the user explicitly chooses dark mode
			localStorage.theme = "dark";
		}

		if (localStorage.theme === "dark") {
			document.documentElement.classList.add("dark");
		} else {
			document.documentElement.classList.remove("dark");
		}

		// Whenever the user explicitly chooses to respect the OS preference
		// localStorage.removeItem("theme");
	}
</script>

<button
use:tooltip={"Toggle darkmode"}
	onclick={() => toggle()}
	class="i-carbon-sun dark:i-carbon-moon h-12 w-12 dark:h-12 dark:w-12 dark:text-white"></button>

<style>
</style>
