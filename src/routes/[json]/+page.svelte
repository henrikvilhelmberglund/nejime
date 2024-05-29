<script lang="ts">
	import DarkModeInit from "$lib/theme/DarkModeInit.svelte";
	import ThemeInit from "$lib/theme/ThemeInit.svelte";
	import Nejime from "../../components/Nejime.svelte";
</script>

<main class="flex flex-col h-screen justify-center items-center dark:bg-black dark:text-white">
<header>
	<ThemeInit />
	<DarkModeInit />
</header>
	<Nejime />
</main>
