<script lang="ts">
	import PatternSelector from "./PatternSelector.svelte";
	import VerticalNumbers from "./VerticalNumbers.svelte";
	import { createActivePatternElementIdState, createSongState } from "./globalState.svelte";
	import { toHex } from "./utils";

	let channels = [0, 1, 2, 3, 4];
	let rows = Array.from({ length: 64 });

	let songState = createSongState();
	let activePatternElementId = createActivePatternElementIdState();

	interface Pattern {
		channel0: string;
		channel1: string;
		channel2: string;
		channel3: string;
		channel4: string;
	}

	$effect(() => {
		if (activePatternElementId && activePatternElementId.value) {
			document
				.querySelector<HTMLButtonElement>(`#nejime #${activePatternElementId.value}`)!
				.focus();
		} else {
			// console.log(document.querySelector("#nejime button"))
			console.log(document.querySelector<HTMLButtonElement>("#nejime button"));
			// setTimeout(() => {
			// 	document.querySelector<HTMLButtonElement>("#nejime button")!.focus();
			// }, 0);
			document.querySelector<HTMLButtonElement>("#nejime button")!.focus();
			// }
		}
	});
</script>

<main class="flex overflow-hidden">
	<VerticalNumbers />
	<div class="flex flex-col">
		{#each rows as row, i}
			<div id={`row${i}`} class="flex gap-4">
				{#each channels as channel, j}
					<PatternSelector
						selectedPattern={songState.value?.[toHex(i) as keyof typeof songState.value]?.[`channel${j}` as keyof Pattern] ?? "--"}
						hex={toHex(i)}
						channel={`channel${j}`}
						id={`row${i}-channel${j}`} />
				{/each}
			</div>
		{/each}
	</div>
</main>

<style>
</style>
