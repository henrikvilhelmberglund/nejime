<script lang="ts">
	import { createActivePhraseElementIdState, createActivePhraseState } from "./globalState.svelte";

	let { id, hex, selectedPhrase }: { id: string; hex: string; selectedPhrase: string } = $props();
	let activePhraseElementId = createActivePhraseElementIdState();
	let activePhrase = createActivePhraseState();

	// let el = document.getElementById("div-1").nextSibling;

	function focusPhraseSelector({ row }: { row: number }) {
		try {
			const phraseSelector: HTMLButtonElement = document.querySelector(`#row-${row}-pattern`)!;
			phraseSelector.focus();
			activePhraseElementId.value = phraseSelector.id;
			activePhrase.value = phraseSelector.innerText;
		} catch (error) {
			console.error(`element ${`#row${row}`} not found, can't focus`);
		}
	}

	function handleKeyPress(e: KeyboardEvent) {
		const row = id.split("row")[1].split("-channel")[0];
		// const channel = id.split("row-")[1].split("-channel-")[1];
		e.preventDefault();
		if (e.code === "ArrowLeft") {
			// TODO transpose here
			// focusPhraseSelector({ row: parseInt(row), channel: parseInt(channel) - 1 });
		} else if (e.code === "ArrowRight") {
			// TODO transpose here
			// focusPhraseSelector({ row: parseInt(row), channel: parseInt(channel) + 1 });
		} else if (e.code === "ArrowUp") {
			focusPhraseSelector({ row: parseInt(row) - 1 });
		} else if (e.code === "ArrowDown") {
			focusPhraseSelector({ row: parseInt(row) + 1 });
		}
	}

	function handleClick(e: MouseEvent) {
		activePhraseElementId.value = (<HTMLButtonElement>e.target).id;
	}

	$effect(() => {
		if (activePhraseElementId && activePhraseElementId.value) {
			console.log("debug", activePhraseElementId.value);
			document.querySelector<HTMLButtonElement>(`#nejime #${activePhraseElementId.value}`)!.focus();
		} else {
			document.querySelector<HTMLButtonElement>("#nejime button")!.focus();
		}
	});
</script>

<button
	{id}
	onkeydown={handleKeyPress}
	onclick={handleClick}
	class="focus:ring-none focus-visible:ring-none focus:bg-selection-500 relative flex h-5 w-6 border-none p-0 text-3xl text-white focus:text-black focus:outline-transparent focus-visible:border-none focus-visible:outline-none">
	<span class="pointer-events-none leading-3">
		{selectedPhrase}
	</span></button>

<style>
</style>
