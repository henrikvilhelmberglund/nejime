<script lang="ts">
	import DarkModeToggle from "$lib/theme/DarkModeToggle.svelte";
	import ThemeSwitcher from "$lib/theme/ThemeSwitcher.svelte";
	import Nejime from "../../components/Nejime.svelte";
</script>

<main class="flex flex-col h-screen justify-center items-center">
<header>
	<ThemeSwitcher />
	<DarkModeToggle />
</header>
	<Nejime />
</main>
