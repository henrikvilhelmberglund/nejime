<script lang="ts">
	import DarkModeToggle from "$lib/theme/DarkModeToggle.svelte";
	import ThemeSwitcher from "$lib/theme/ThemeSwitcher.svelte";
	import Instrument from "./Instrument.svelte";
	import Pattern from "./Pattern.svelte";
	import Phrase from "./Phrase.svelte";
	import Project from "./Project.svelte";
	import Song from "./Song.svelte";
	import {
		createSPressedState,
		createDPressedState,
		createFPressedState,
		createActiveScreenState,
		createIsPlayingBackState,
		createIntervalIdState,
		createBpmState,
		createPhraseLoopIntervalIdState,
		createLastPhraseHexState,
		createLastPatternHexState,
		createPatternsState,
		createPhrasesState,
		createPlayPositionPhraseState,
		createPlayPositionPatternState,
		saveSong,
		createSongState,
		createPlayPositionsPhrasesState,
		createPlayPositionsPatternsState,
		createPlayPositionsSongState,
		createIntervalIdsSongState
	} from "./globalState.svelte";
	import { playPhrase, playPhraseFromSong, stop, toHex } from "./utils";

	let allStates = ["song", "pattern", "phrase", "instrument", "project-song", "project-pattern"];
	let activeScreenState = createActiveScreenState();

	let sPressed = createSPressedState();
	let dPressed = createDPressedState();
	let fPressed = createFPressedState();
	let isPlayingBack = createIsPlayingBackState();
	let bpmState = createBpmState();

	function changeState(direction: string) {
		let activeElement = <HTMLButtonElement>document.activeElement!;
		if (activeScreenState.value === "song" && direction === "right") {
			if (activeElement.innerText === "--") return;
			activeScreenState.value = "pattern";
		} else if (activeScreenState.value === "pattern" && direction === "left") {
			activeScreenState.value = "song";
		} else if (activeScreenState.value === "pattern" && direction === "right") {
			if (activeElement.innerText === "--") return;
			activeScreenState.value = "phrase";
		} else if (activeScreenState.value === "song" && direction === "up") {
			activeScreenState.value = "project-song";
		} else if (activeScreenState.value === "pattern" && direction === "up") {
			activeScreenState.value = "project-pattern";
		} else if (activeScreenState.value === "project-song" && direction === "down") {
			activeScreenState.value = "song";
		} else if (activeScreenState.value === "project-pattern" && direction === "down") {
			activeScreenState.value = "pattern";
		} else if (activeScreenState.value === "phrase" && direction === "left") {
			activeScreenState.value = "pattern";
		}
	}
	const intervalId = createIntervalIdState();
	const phraseLoopIntervalId = createPhraseLoopIntervalIdState();
	let lastPhraseHex = createLastPhraseHexState();
	let lastPatternHex = createLastPatternHexState();
	let song = createSongState();
	let patterns = createPatternsState();
	let phrases = createPhrasesState();
	let playPositionPhrase = createPlayPositionPhraseState();
	const playPositionPattern = createPlayPositionPatternState();

	let playPositionsPhrases = createPlayPositionsPhrasesState();
	let playPositionsPatterns = createPlayPositionsPatternsState();
	let playPositionsSong = createPlayPositionsSongState();
	let intervalIdsSongState = createIntervalIdsSongState();

	function handleKeyDown(e: KeyboardEvent) {
		// console.log(e);
		if (e.code === "KeyS") {
			sPressed.value = true;
		}
		if (e.code === "KeyD") {
			dPressed.value = true;
		}
		if (e.code === "KeyF") {
			fPressed.value = true;
		}
		if (sPressed.value && e.code === "ArrowRight") {
			changeState("right");
		}
		if (sPressed.value && e.code === "ArrowLeft") {
			changeState("left");
		}
		if (sPressed.value && e.code === "ArrowUp") {
			changeState("up");
		}
		if (sPressed.value && e.code === "ArrowDown") {
			changeState("down");
		}
		if (e.code === "Space") {
			if (!isPlayingBack.value) {
				if (activeScreenState.value === "song") {
					// ? caused issue when editing notes while phrase was playing
					// play(activeScreenState.value, lastPhraseHex.value);
					// after first play, start looping
					// phraseLoopIntervalIdState.value = setInterval(
					// 	() => {
					// 		play(activeScreenState.value, lastPhraseHex.value);
					// 	},
					// 	1000 * 16 * (60 / (bpmState.value * 4))
					// );

					if (e.ctrlKey) {
						const position = document.activeElement!.id.split("row")[1].split("-pattern")[0];
						console.log("position", position);
						playPositionPattern.value = parseInt(position);
					} else {
						playPositionPattern.value = 0;
					}

					["channel0", "channel1", "channel2", "channel3", "channel4"].forEach((channel, i) => {
						// console.table(phrasesToPlay);
						console.log("i", i);
						const patternsToPlay = song.value["00"];
						const phrasesToPlay = patterns.value?.[patternsToPlay[channel]];
						console.log("phrasesToPlay", phrasesToPlay);
						if (phrasesToPlay) {
							playPhraseFromSong(
								activeScreenState.value,
								phrasesToPlay[toHex(playPositionsPatterns.value[i])],
								i
							);

							intervalIdsSongState.value[i] = setInterval(
								() => {
									if (playPositionsPhrases.value[i] < 15) {
										playPositionsPhrases.value[i] += 1;
										playPhraseFromSong(
											activeScreenState.value,
											phrasesToPlay[toHex(playPositionsPatterns.value[i])],
											i
										);
									} else {
										playPositionsPatterns.value[i] += 1;
										if (!phrasesToPlay[toHex(playPositionsPatterns.value[i])]) {
											playPositionsPatterns.value[i] = 0;
										}

										playPositionsPhrases.value[i] = 0;
										playPhraseFromSong(
											activeScreenState.value,
											phrasesToPlay[toHex(playPositionsPatterns.value[i])],
											i
										);
									}
								},
								1000 * (60 / (bpmState.value * 4))
							);
						}
					});
				}
				if (activeScreenState.value === "pattern") {
					// ? caused issue when editing notes while phrase was playing
					// play(activeScreenState.value, lastPhraseHex.value);
					// after first play, start looping
					// phraseLoopIntervalIdState.value = setInterval(
					// 	() => {
					// 		play(activeScreenState.value, lastPhraseHex.value);
					// 	},
					// 	1000 * 16 * (60 / (bpmState.value * 4))
					// );

					const phrasesToPlay = patterns.value[lastPatternHex.value];

					if (e.ctrlKey) {
						const position = document.activeElement!.id.split("row")[1].split("-pattern")[0];
						console.log("position", position);
						playPositionPattern.value = parseInt(position);
					} else {
						playPositionPattern.value = 0;
					}

					// console.table(phrasesToPlay);
					playPhrase(activeScreenState.value, phrasesToPlay[toHex(playPositionPattern.value)]);

					intervalId.value = setInterval(
						() => {
							if (playPositionPhrase.value < 15) {
								playPositionPhrase.value += 1;
								playPhrase(
									activeScreenState.value,
									phrasesToPlay[toHex(playPositionPattern.value)]
								);
							} else {
								playPositionPattern.value += 1;
								if (!phrasesToPlay[toHex(playPositionPattern.value)]) {
									playPositionPattern.value = 0;
								}

								playPositionPhrase.value = 0;
								playPhrase(
									activeScreenState.value,
									phrasesToPlay[toHex(playPositionPattern.value)]
								);
							}
						},
						1000 * (60 / (bpmState.value * 4))
					);
				}
				if (activeScreenState.value === "phrase") {
					// ? caused issue when editing notes while phrase was playing
					// play(activeScreenState.value, lastPhraseHex.value);
					// after first play, start looping
					// phraseLoopIntervalIdState.value = setInterval(
					// 	() => {
					// 		play(activeScreenState.value, lastPhraseHex.value);
					// 	},
					// 	1000 * 16 * (60 / (bpmState.value * 4))
					// );

					if (e.ctrlKey) {
						const position = document.activeElement!.id.split("-channel")[0].split("note")[1];
						console.log("position", position);
						playPositionPhrase.value = parseInt(position);
					} else {
						playPositionPhrase.value = 0;
					}
					playPhrase(activeScreenState.value, lastPhraseHex.value);

					intervalId.value = setInterval(
						() => {
							if (playPositionPhrase.value < 15) {
								playPositionPhrase.value += 1;
								playPhrase(activeScreenState.value, lastPhraseHex.value);
							} else {
								playPositionPhrase.value = 0;
								playPhrase(activeScreenState.value, lastPhraseHex.value);
							}
						},
						1000 * (60 / (bpmState.value * 4))
					);
				}
				isPlayingBack.value = true;
			} else {
				stop(activeScreenState.value);
				isPlayingBack.value = false;
				intervalIdsSongState.stopAllIntervals();
				intervalId.stop();
				phraseLoopIntervalId.stop();
			}
		}
	}
</script>

<button
	onclick={() => {
		let start = performance.now();
		const savedSong = saveSong();
		let timeTaken = performance.now() - start;
		console.log("Total time taken : " + timeTaken + " milliseconds");
		console.log(savedSong);
	}}>Save</button>
<a
	href="/N4IgRgDgtiBcCMAmADAGhASwHYGcAuATgK5QCmWeAIkQQIZ4YD2ucoyycyAdAMzrLxOXeAF90OZgHNWIdjIDGAC1pYspADYdYsjuiUq16wdoEg9y1RsRxZ18wY08byJ-cvqALM69jZx0PruWiAoZiCBhsYhgm6G1tqIduEWhk4JrskOnjaIPr4Q9HikBCywbFrlNvC6flUxtlVJLlUZyF7a8F78AKxVvfwAbFVdsgDsfWHIABxVNcgAnHWTAIKNkwBCLSC+pmU6Nh71uyAeTfEnrWknI20H-bK92h5Dg3eT408vsjNPR4tPTVWT1amyeeXQhBUOAgjBwpAACoViqVKns5CY5uc5Px2vsdv59hjJlFsQ0iSJ8oo6HCcDJqjJ0aiQABhG641mTH4gADiN2ZNl5234-gp6HgBMZhJAyzZNhlnIFPmFrB28WAopASAZFSlADFZdp9QrtABRPk2M1C2plVUq3zwNKopmUA0gF3GlngzXtJ1SwU4xUeo38fmGr3wR6+9EgS0B003LnujWHbWp7TM+7TC29ZNqwlM3WZrkmnO+DyO-NSyhFmwZ7Zln2V6PyuMgdYJ2ul9AeSNN4Ilya4-3fGzVyahnle55ppl11vDrPadvjwMUynU0gASVwhBI5DwtL29LRwVJxwAtOfJudL5MrreejYH7JcWeuWeJ3J7RLT3NX3N3w4e082jM9-w9D9nCAsUK1Av8oIg6DvTTfZWzfBCQwQ+1ezgwcMJHclux-ZwjlxZ9F1qTDtFvMsQNPUinyvfh3yOIEQHIicaO7WD6Lw6imIIyjZEoRiV34q0PEbUCGJMI4WLE9irzLHDeLQuSSIU0wyyGE8NLUiCjk-QQ1yAA"
	>Twinkle Twinkle Little Star</a>
<div
	id="nejime"
	role="presentation"
	onkeydown={(e) => handleKeyDown(e)}
	onkeyup={(e) => {
		// console.log(e);
		if (e.code === "KeyS") {
			sPressed.value = false;
		}
		if (e.code === "KeyD") {
			dPressed.value = false;
		}
		if (e.code === "KeyF") {
			fPressed.value = false;
		}
	}}
	class="bg-primary-400 flex h-[500px] w-[500px] flex-col rounded-lg border-2 border-black text-black dark:text-white">
	{#if activeScreenState.value === "song"}
		<Song />
	{:else if activeScreenState.value === "pattern"}
		<Pattern />
	{:else if activeScreenState.value === "phrase"}
		<Phrase />
	{:else if activeScreenState.value === "instrument"}
		<Instrument />
	{:else if activeScreenState.value === "project-song" || activeScreenState.value === "project-pattern"}
		<Project />
	{/if}
</div>

<style>
</style>
