<script lang="ts">
	import DarkModeToggle from "$lib/theme/DarkModeToggle.svelte";
	import ThemeSwitcher from "$lib/theme/ThemeSwitcher.svelte";
	import Button from "../components/Button.svelte";
</script>

<div class="p-2">
	<ThemeSwitcher />
	<DarkModeToggle />
	<Button
		onclick={() => {
			alert("This is an alert");
		}}>Alert</Button>
</div>
