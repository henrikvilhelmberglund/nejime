<script lang="ts">
	import BpmSelector from "./BPMSelector.svelte";
	import { createActiveScreenState } from "./globalState.svelte";

	let activeScreenState = createActiveScreenState();
</script>

<p class="pl-1 text-lg font-semibold text-white">
	{activeScreenState.value.toUpperCase()}
</p>
<main class="flex gap-2 overflow-hidden">
	<p class="text-white">BPM</p>
	<div class="flex flex-col">
		<BpmSelector id={`bpm-selector`} />
	</div>
</main>

<style>
</style>
