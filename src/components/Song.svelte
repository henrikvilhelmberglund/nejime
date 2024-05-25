<script lang="ts">
	import PatternSelector from "./PatternSelector.svelte";
	import VerticalNumbers from "./VerticalNumbers.svelte";
	import {
		activeScreenState,
		isPlayingBack,
		lastChannelPattern,
		lastRowPattern,
		createPlayPositionsSongState,
		song
	} from "./globalState.svelte";
	import { toHex } from "./utils";

	let channels = [0, 1, 2, 3, 4];
	let rows = Array.from({ length: 64 });

	let playPositionsSong = createPlayPositionsSongState();

	interface Pattern {
		channel0: string;
		channel1: string;
		channel2: string;
		channel3: string;
		channel4: string;
	}

	$effect(() => {
		if (lastRowPattern.value !== undefined) {
			queueMicrotask(() => {
				document
					.querySelector<HTMLButtonElement>(
						`#nejime #row${lastRowPattern.value}-channel${lastChannelPattern.value}`
					)!
					.focus();
			});
		} else {
			const patternSelector = document.querySelector<HTMLButtonElement>("#nejime button")!;
			queueMicrotask(() => {
				patternSelector.focus();
			});
			// }
		}
	});
</script>

<p class="pl-1 text-lg font-semibold text-white">{activeScreenState.value.toUpperCase()}</p>
<main class="flex overflow-hidden">
	<VerticalNumbers />
	<div class="flex flex-col">
		{#each rows as _, i}
			<div id={`row${i}`} class="relative flex gap-4">
				{#each channels as _, j}
					{#if isPlayingBack.value && playPositionsSong.value[j] !== undefined && playPositionsSong.value[j] === i}
						<div
							style={`left: ${j * 40 - 16}px`}
							class="i-ph-play-fill absolute py-[10px] text-xs text-white">
						</div>
					{/if}
					<PatternSelector
						selectedPattern={song.value?.[toHex(i) as keyof typeof song.value]?.[`channel${j}` as keyof Pattern] ?? "--"}
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
