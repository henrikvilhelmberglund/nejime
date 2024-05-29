<script lang="ts">
	import DarkModeInit from "$lib/theme/DarkModeInit.svelte";
	import ThemeInit from "$lib/theme/ThemeInit.svelte";
	import Nejime from "../../components/Nejime.svelte";
</script>

<main
	oncontextmenu={(e) => {
		e.preventDefault();
		e.stopPropagation();
		e.stopImmediatePropagation();
    return false;
	}}
	class="flex h-[86vh] flex-col items-center bg-hero-bathroom-floor-blue-500/5 lg:justify-center dark:bg-black dark:text-white">
	<header>
		<ThemeInit />
		<DarkModeInit />
	</header>
	<Nejime />
</main>

<style>
	:root {
		touch-action: pan-x pan-y;
		height: 100%;
    user-select: none;
    -webkit-user-select: none;
    -webkit-user-drag: none;
	}
</style>
