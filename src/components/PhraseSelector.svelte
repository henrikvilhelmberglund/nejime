<script lang="ts">
	let name = $state("--");
	let { id }: { id: string } = $props();

	// let el = document.getElementById("div-1").nextSibling;

	function focusPhraseSelector({ row, channel }: { row: number; channel: number }) {
		try {
			const phraseSelector: HTMLButtonElement = document.querySelector(
				`#row-${row}-channel-${+channel}`
			)!;
			phraseSelector.focus();
		} catch (error) {
			console.error(`element ${`#row-${row}-channel-${+channel}`} not found, can't focus`);
		}
	}

	function handleKeyPress(e: KeyboardEvent) {
		const row = id.split("row-")[1].split("-channel")[0];
		const channel = id.split("row-")[1].split("-channel-")[1];
		e.preventDefault();
		if (e.code === "ArrowLeft") {
			focusPhraseSelector({ row: parseInt(row), channel: parseInt(channel) - 1 });
		} else if (e.code === "ArrowRight") {
			focusPhraseSelector({ row: parseInt(row), channel: parseInt(channel) + 1 });
		} else if (e.code === "ArrowUp") {
			focusPhraseSelector({ row: parseInt(row) - 1, channel: parseInt(channel) });
		} else if (e.code === "ArrowDown") {
			focusPhraseSelector({ row: parseInt(row) + 1, channel: parseInt(channel) });
		}
	}
</script>

<button
	{id}
	onkeydown={handleKeyPress}
	class="focus:ring-none focus-visible:ring-none flex h-6 w-6 items-center justify-center border-none p-0 text-center text-2xl focus:bg-blue-500 focus:outline-transparent focus-visible:border-none focus-visible:outline-none"
	>{name}</button>

<style>
</style>
