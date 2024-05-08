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
		createIntervalIdsSongState,
		createPlayPositionSongState,
		createTransposePatternsState
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
	const lastPhraseHex = createLastPhraseHexState();
	const lastPatternHex = createLastPatternHexState();
	const song = createSongState();
	const patterns = createPatternsState();
	const transposePatterns = createTransposePatternsState();
	const phrases = createPhrasesState();
	const playPositionPhrase = createPlayPositionPhraseState();
	const playPositionPattern = createPlayPositionPatternState();
	const playPositionSong = createPlayPositionSongState();

	const playPositionsPhrases = createPlayPositionsPhrasesState();
	const playPositionsPatterns = createPlayPositionsPatternsState();
	const playPositionsSong = createPlayPositionsSongState();
	const intervalIdsSongState = createIntervalIdsSongState();

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
						const position = document.activeElement!.id.split("row")[1].split("-channel")[0];
						console.log("position", position);
						const newPosition = parseInt(position);
						playPositionsSong.value = {
							0: newPosition,
							1: newPosition,
							2: newPosition,
							3: newPosition,
							4: newPosition
						};
					} else {
						playPositionsSong.value = { 0: 0, 1: 0, 2: 0, 3: 0, 4: 0 };
					}

					console.log("playPositions", playPositionsSong.value);
					["channel0", "channel1", "channel2", "channel3", "channel4"].forEach((channel, i) => {
						// console.table(phrasesToPlay);
						let patternsToPlay = song.value[toHex(playPositionsSong.value[i])];
						let phrasesToPlay = patterns.value?.[patternsToPlay[channel]];
						let transposeToPlay = transposePatterns.value?.[patternsToPlay[channel]] ?? "00";
						if (phrasesToPlay) {
							playPhraseFromSong(
								activeScreenState.value,
								phrasesToPlay[toHex(playPositionsPatterns.value[i])],
								i,
								transposeToPlay
							);

							intervalIdsSongState.value[i] = setInterval(
								() => {
									if (playPositionsPhrases.value[i] < 15) {
										playPositionsPhrases.value[i] += 1;
										// update data
										patternsToPlay = song.value[toHex(playPositionsSong.value[i])];
										phrasesToPlay = patterns.value?.[patternsToPlay[channel]];
										transposeToPlay = transposePatterns.value?.[patternsToPlay[channel]] ?? "00";

										playPhraseFromSong(
											activeScreenState.value,
											phrasesToPlay[toHex(playPositionsPatterns.value[i])],
											i,
											transposeToPlay
										);
									} else {
										playPositionsPatterns.value[i] += 1;
										if (phrasesToPlay[toHex(playPositionsPatterns.value[i])] === undefined) {
											playPositionsPatterns.value[i] = 0;
											playPositionsSong.value[i] += 1;
										}
										// update data
										patternsToPlay = song.value[toHex(playPositionsSong.value[i])];
										// if empty pattern, go back to start
                    if (!patternsToPlay) {
                      playPositionsSong.value[i] = 0;
                      patternsToPlay = song.value[toHex(playPositionsSong.value[i])];
										}
										phrasesToPlay = patterns.value?.[patternsToPlay[channel]];
										transposeToPlay = transposePatterns.value?.[patternsToPlay[channel]] ?? "00";


										playPositionsPhrases.value[i] = 0;
										playPhraseFromSong(
											activeScreenState.value,
											phrasesToPlay[toHex(playPositionsPatterns.value[i])],
											i,
											transposeToPlay
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
	href="/N4IgRgDgtiBcCMAmADAGhASwHYGcAuATgK5QCmWeAIkQQIZ4YD2ucoyycyAdAMzrLxOXeAF90OZgHNWIdjIDGAC1pYspADYdYsjuiUq16wdoEg9y1RsRxZ18wY08byJ-cvqALM69jZx0PruWiAoZiCBhsYhgm6G1tqIduEWhk4JrskOnjaIPr4Q9HikBCywoKFlOjbwun7VMbbVSS7VGche2vBe-ACs1X38AGzV3bIA7P1hyAAc1bXIAJz1UwCCTVMAQq0gvoj+VdoeDaaHzfEgHm1pF6PtNh4Dsn2Hw0P3j8gTL1Ozh8dLp1W9zaW0OPn4WjYwRqUyi8GO5yQU2u8DaHRAXSmzwxH2GnVuXxxPzmUwBGOOa06zVBGKcvhOUPuxyiHjOwOR91u6IeWPur1keIuH0JHn5MyZpPuzUpFxBnJ2vkIKhwEEYOFIAAVCsVSuVIQcnrDnB9zsgPtczVN0ZbesapoSbQK7fxfob+GTHcgZZ6aZbdvs5CYPlFPabzc7ZNaPtjPYLPQ6Pq7PR6Pt6Pr6+vT9YGqvxTfNrRx6QHgnJ+CH5vmFegIIo6OqcDIYZVA4ztABhLk2TvE7QAcVu7ZsA525dYIl88JkrYNKy72jnvZAI+L47z48n8TbbZAADF53vbq6AKKDmyn0d1Mr0rcT9Co6fZ4KUA8vpc9u8Yjrbg0j-jov9ZFdfcpiHbQQM-eBnh-HML3-c8jxsN9PyOR80I7RNz0zXxWXQndd0w7Rj2w9BLjwg1KEIkB2xIm5yJzRd4O0DZEIw6shXo4JiKtYdWJASjQN49jRU47sPgAviWME-s8nyOtaHVABJXBCBIcg8EbSpmx3MsrxAABafSpnOQyOW0UzbXMoymNzIDnHmMCqknEt7J4kx5iTIt7y3A1dLudylz8xy5EnNIdILVyXVcydv18iKAqihLZGCryiRbUt4ts8UApwlyTGOdELLs-LpIMoycJ8nNTBsorsrqfgZVqxzTJwsLfIKmxaqTY5KE66zkr6y8PFiqqOpKxL6oGqyhug9q3MmurqqmuocLxHSxoW7rStMCcRCAA"
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
