<script lang="ts">
	import { page } from "$app/stores";
	import { tooltip } from "$lib/actions/tooltip";
	import DarkModeToggle from "$lib/theme/DarkModeToggle.svelte";
	import ThemeSwitcher from "$lib/theme/ThemeSwitcher.svelte";
	import type { MouseEventHandler } from "svelte/elements";
	import { newSong, saveSong } from "./globalState.svelte";

	let {
		onShowTutorial,
		onShowInfo
	}: {
		onShowTutorial: MouseEventHandler<HTMLButtonElement>;
		onShowInfo: MouseEventHandler<HTMLButtonElement>;
	} = $props();

	let showing = $state("");

	function toggle(input: string) {
		showing = showing === input ? "" : input;
	}

	function closeSelf(node: any) {
		setTimeout(() => {
			showing = showing === "showSaveSuccessful" ? "" : showing;
		}, 1000);

		return {
			// the node has been removed from the DOM
		};
	}
</script>

<footer class="fixed bottom-0 flex gap-2 lg:fixed lg:bottom-0 dark:bg-black dark:text-white">
	<button
		id="create-song-button"
		use:tooltip={"Create song"}
		onclick={() => {
			toggle("createSong");
		}}
		class="i-carbon-music-add h-12 w-12">Create new song</button>
	{#if showing === "createSong"}
		<div class="border-1 absolute -top-20 left-0 border-slate-400 bg-white p-4 dark:bg-black">
			<p>Create new song?</p>
			<button
				onclick={() => {
					newSong();
					showing = "";
				}}
				class="ph-2 rounded-md bg-green-300 px-4">Create</button>
		</div>
	{/if}
	<button
		id="show-songs-button"
		use:tooltip={"Show demo song"}
		onclick={() => {
			toggle("showSongs");
		}}
		class="i-carbon-music h-12 w-12">Show demo song</button>
	{#if showing === "showSongs"}
		<div class="border-1 absolute -top-20 left-12 border-slate-400 bg-white p-4 dark:bg-black">
			<a
				href="/N4IgRgDgtiBcCMBmAHAGhASwHYGcAuATgK5QCmWeOcoADDdSHgJ4Slwg4D2RWAJgGacKIdAAtSAD3Y1EIAL7oAYoobNW7LjwFC8vYlCpjJ7ZfPQ14qlm1gdufQcKNTbAJgCsZkDVdX1tzQcdERBxFxAANl85BUxcQhJyPAARIgIAQzwMISpYWnpYGgA6RFiuLABzBjoGAGNRdKwsUgAbAu96dHrG5pbLW3hOkG6m1t83IZHe2VtESYbRloAWdiX6WIs6hd72za7t1v6QeEt9nrH2V1Phg5aZkERrqdaV2yXLGPQITLxSAlwGINqu0geYjicQj52PBfOZ7khIa9jitzJ4Bp5zBFoSjvAB2aEY7zIaFDGgATmh1xoAEFobDvAAhaGyWIQvIdEmQ8FU8bHekyZmI7GQtHHQk0LEDHE0fHoyHEgakikDKm0gb8pkDFnoVwFfKXUlHK6Q3mufn3VyycxI1zS0UeSGSkC2yGy53ihXOpWXVWXDWXbXO-r6iZcn0mv2Qi1W7w2u2XcVOl3mN0O8ye3WQ5VByFq53+tyBtbA1aG0sRt6k+7vIVvfmipb8p2N12rGM0T1LaXZ4vmPO9xmrD7oGvsmqVsMT8y8gcCt5UpEt1GrJsr1tvdud7vlvs7wfzrzjkMcsHSHnSc3SdtImjx2w0RPSaVuh-y6Te++++8F7yBzZj3Yy0-CtvEve9ryfEVpEfe9n2gt97w-bwv1AyFNV-eRYkIRocAgTgcFIAAFH4-gBdk2WPV9T3vcVeSojCaNrbxxVFeiJXglMOKJLjyR4vM2PQ19YmNACeKONi6PFe42JvFieKdNiXw9HjszY-jxUEzwNmDDkVUnY5zz0uFKSYiFlyM7wnTMvETPTWzvGzayaXsmh0IhDY9V07wAGF9JoXzp2kAKGJ8pj-Kg+9gvYyL11CuyYvMVSov4qLBN8z4QAgUQMgI3JQCBUTCpAbz+U9ABRaJWR0o8vMUUr2AqzD0BhEsiuSerbBKprjhmENj2pBd2AZKlPS6jL4FePqvMa612AAcSpXzbAWhCQHa7r4DRKbb3mxbdshdouvikBhu6zNCuPbzlM6rTqOPMrrpAB6zuqzzx2Kx6rsParyvFdpFC04Txm2w7Ptu5DWrWx7noyy1WsusHvshgGmOSaHAZ1SbdNoJE5ulJaQDxpGxyRBl8aGlYNmB2N5vFAm5ox914Zp5bydZ4mcfYL7zAJsnD2pnblrp2nuuLC6vNO7Tqk9daqeRgBifkkUURXVpV-kCfV0XXsh07ZtsSW7u42xZcCoqtf1kALeN4r5fbAnqVVjKW3F97DYhscZeiM3jzm1WzcJ-2WZAR2OsD-k8z9jX2FD0XeuxiXhw92gvf56Wubtg75qDqFlpzpFY42ePwpN9tki59syqG-kVFsalKpHLGardpP-xT9hTdQorqQg2xrY7Ewc81p2POZ97vOlJEJ9Womefmym7rlvIMrbhP3upSeY+lT0iZXgW3v+ze++3hq2aeymi7H9pkiPtaT86i-9ZB+emNnm3FDPj-utfV32jK2--6rRvphWIWUcqkAAJLxH0EkPKxwD5nlWpsKqkM9g22Qc1feiDjoYJ6qgwawEcFJwmvgiKIAAC05Cwp7UIeg4hW1g5oJLhDcwuwRqIOEgg78TFKFIO9jmIqUIcH8LNKgsOUJhLF12ErC8fCvAuhJrIue3DhIMMFqhZRqFYhi2PKYY6ejg4GOYaYbROs+4qH0RYwxVjjEqG0Vg8xasbHKxsbyIxeYjGazsSOKRJgbGek8X4yE5dHHmCrqE7wtcrauKCZbExjdkb+NidYyEXjDxcJPIw0knoajmBCRQqhmjcnMXYLwqWgjSQ3mye+NOFSwrVMQqkmpl86mW2KQPRpGwm6AXqUg0kBMagbDUT0tpDSOQxDkEAA"
				>Demo</a>
		</div>
	{/if}

	<button
		id="save-song-button"
		use:tooltip={"Save song"}
		class="i-carbon-save h-12 w-12"
		onclick={() => {
			let start = performance.now();
			const savedSong = saveSong();
			let timeTaken = performance.now() - start;
			console.log("Total time taken : " + timeTaken + " milliseconds");
			console.log(savedSong);
			const currentURL = $page.url.origin;
			navigator.clipboard.writeText(`${currentURL}/${savedSong}`);
			toggle("showSaveSuccessful");
		}}>Save song</button>
	{#if showing === "showSaveSuccessful"}
		<p
			use:closeSelf
			class="animate-custom-fade animate-duration-1050 absolute -top-20 left-16 w-max rounded-md bg-green-500 p-2 text-center font-semibold text-white">
			Saved song to clipboard!
		</p>
	{/if}
	<button
		id="show-themes-button"
		use:tooltip={"Show themes"}
		class="i-carbon-color-palette h-12 w-12"
		onclick={() => toggle("showThemes")}>Show themes</button>
	{#if showing === "showThemes"}
		<ThemeSwitcher />
	{/if}
	<DarkModeToggle />
	<button
		id="show-tutorial-button"
		use:tooltip={"Show tutorial"}
		onclick={onShowTutorial}
		class="i-carbon-help h-12 w-12">Show tutorial</button>
	<button
		id="show-info-button"
		onclick={onShowInfo}
		use:tooltip={"Show information"}
		class="i-carbon-information h-12 w-12">Show info</button>
</footer>

<style>
</style>
