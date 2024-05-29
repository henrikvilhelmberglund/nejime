<script lang="ts">
	import DarkModeToggle from "$lib/theme/DarkModeToggle.svelte";
	import ThemeSwitcher from "$lib/theme/ThemeSwitcher.svelte";
	import { page } from "$app/stores";
	import Instrument from "./Instrument.svelte";
	import Pattern from "./Pattern.svelte";
	import Phrase from "./Phrase.svelte";
	import Project from "./Project.svelte";
	import Song from "./Song.svelte";
	import {
		activeScreenState,
		createIntervalIdState,
		createPhraseLoopIntervalIdState,
		saveSong,
		createPlayPositionsPhrasesState,
		createPlayPositionsPatternsState,
		createPlayPositionsSongState,
		createIntervalIdsSongState,
		transposePatterns,
		newSong,
		sPressed,
		dPressed,
		fPressed,
		isPlayingBack,
		bpm,
		openedInstrument,
		lastPhraseHex,
		lastPatternHex,
		song,
		patterns,
		phrases,
		lastChannelPattern
	} from "./globalState.svelte";
	import { playPhrase, playPhraseFromSong, stop, toHex } from "./utils";
	import { fade } from "svelte/transition";
	import Buttons from "./Buttons.svelte";

	let allStates = ["song", "pattern", "phrase", "instrument", "project-song", "project-pattern"];

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
		} else if (activeScreenState.value === "phrase" && direction === "up") {
			const instrumentOnRow =
				activeElement.id.includes("instrument-selector") ?
					activeElement
				:	<HTMLButtonElement>(
						document.querySelector(
							`#instrument-selector${activeElement.id.split("note")[1].split("-")[0]}`
						)
					);

			if (instrumentOnRow) {
				const instrumentNumberOnRow = instrumentOnRow.innerText;
				openedInstrument.value = instrumentNumberOnRow;
				activeScreenState.value = "instrument";
			}
		} else if (activeScreenState.value === "instrument" && direction === "down") {
			activeScreenState.value = "phrase";
		}
	}

	const intervalId = createIntervalIdState();
	const phraseLoopIntervalId = createPhraseLoopIntervalIdState();
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
				if (activeScreenState.value === "song" || activeScreenState.value === "project-song") {
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

										// don't try to play if there are no phrases to play in the pattern
										if (phrasesToPlay?.[toHex(playPositionsPatterns.value[i])] !== undefined) {
											playPhraseFromSong(
												activeScreenState.value,
												phrasesToPlay[toHex(playPositionsPatterns.value[i])],
												i,
												transposeToPlay
											);
										}
									} else {
										playPositionsPatterns.value[i] += 1;
										if (phrasesToPlay?.[toHex(playPositionsPatterns.value[i])] === undefined) {
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
										if (phrasesToPlay?.[toHex(playPositionsPatterns.value[i])] !== undefined) {
											playPhraseFromSong(
												activeScreenState.value,
												phrasesToPlay[toHex(playPositionsPatterns.value[i])],
												i,
												transposeToPlay
											);
										}
									}
								},
								1000 * (60 / (bpm.value * 4))
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
						playPositionsPatterns.value["0"] = parseInt(position);
					} else {
						playPositionsPatterns.value["0"] = 0;
					}

					// console.table(phrasesToPlay);
					playPhrase(
						activeScreenState.value,
						phrasesToPlay[toHex(playPositionsPatterns.value["0"])]
					);

					intervalId.value = setInterval(
						() => {
							if (playPositionsPhrases.value["0"] < 15) {
								playPositionsPhrases.value["0"] += 1;
								playPhrase(
									activeScreenState.value,
									phrasesToPlay[toHex(playPositionsPatterns.value["0"])]
								);
							} else {
								playPositionsPatterns.value["0"] += 1;
								if (!phrasesToPlay[toHex(playPositionsPatterns.value["0"])]) {
									playPositionsPatterns.value["0"] = 0;
								}

								playPositionsPhrases.value["0"] = 0;
								playPhrase(
									activeScreenState.value,
									phrasesToPlay[toHex(playPositionsPatterns.value["0"])]
								);
							}
						},
						1000 * (60 / (bpm.value * 4))
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
						playPositionsPhrases.value["0"] = parseInt(position);
					} else {
						playPositionsPhrases.value["0"] = 0;
					}
					playPhrase(activeScreenState.value, lastPhraseHex.value);

					intervalId.value = setInterval(
						() => {
							if (playPositionsPhrases.value["0"] < 15) {
								playPositionsPhrases.value["0"] += 1;
								playPhrase(activeScreenState.value, lastPhraseHex.value);
							} else {
								playPositionsPhrases.value["0"] = 0;
								playPhrase(activeScreenState.value, lastPhraseHex.value);
							}
						},
						1000 * (60 / (bpm.value * 4))
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

	function handlePopover(this: HTMLParagraphElement) {
		setTimeout(() => {
			this.hidePopover();
		}, 1000);
	}
</script>

<div
	tabindex="-1"
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
	class="bg-primary-400 dark:bg-primary-950 flex lg:h-[500px] h-[50%] w-[80%] lg:w-[500px] flex-col rounded border border-black text-black dark:text-white">
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
<Buttons/>

<style>
</style>
