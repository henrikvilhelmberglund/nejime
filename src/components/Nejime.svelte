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
		phrases
	} from "./globalState.svelte";
	import { playPhrase, playPhraseFromSong, stop, toHex } from "./utils";
	import { fade } from "svelte/transition";

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

<button
	popovertarget="save-song-text"
	onclick={() => {
		let start = performance.now();
		const savedSong = saveSong();
		let timeTaken = performance.now() - start;
		console.log("Total time taken : " + timeTaken + " milliseconds");
		console.log(savedSong);
		const currentURL = $page.url.origin;
		navigator.clipboard.writeText(`${currentURL}/${savedSong}`);
	}}>Save</button>
	<p id="save-song-text" class="mx-auto mt-80 text-center border-green-500 border-2 rounded-md animate-custom-fade animate-duration-1050" popover="auto" ontoggle={handlePopover}>Saved song!</p>
<a
	href="/N4IgRgDgtiBcCMAmADAGhASwHYGcAuATgK5QCmWeOcoyy1IeAnhKXCDgPZFYAmAZhwoh0AC1IAPNgGYAwiAC+6ZPHpMWbTt36C8wkGMmwQyABwL0AMQurmrI5t4CKPYlCqiJbKwsWZchEnI8ABEiAgBDPAxBKlgaOlhkADopJRVEpPhfTiwAc3paegBjEXCsLFIAGwTjOnQSsorK9OMVetLyqsQ2ZG72xqqpHqH+zsqAFh7J32VijqaalD0GsZbENpAVpu6jRD7N+cG2RBGDgYnj6d8ISLxSAlx6Jbjatng61reN3rf95CGjPBTshJoDJkoAKxvKFKABsb3BxgA7NC9KY3h9kABOL5ogCCvzRACE3kNfOsCjVxt8WuM-jsQONgQDGYiQWxxjDjFCjON4XCOVzkCjefzjGZed8cby-gTecCSbzpkoEvEMWiWvBvgykGiWUC0aCQPA2TzjUL4WC0SLzWiJcbMdLjd85ca-orjWS0pSOTSOfSOcyOWyjZy0Wa+WjLYyhTbI0p7dS0U66fjA8Tgz50IQyjgIBwcKQAAq3e6PF7PNVGZBClo1tEM+tKFlN4xG1v16uxnoWnt2vtKJ0d10dj318npKvcjUD4yNoUtoXtoVmjvRjs2jv2jtDoUjoVjqEzVWvauYxuY9t0GaT0+vb1nhs9a-XEQRQuxUDvH0vQpGGQhmwAH9kYADibJyGByqfHE8i+FqP5TnigFGMhIEgOB5gwcAMw7Dh8F4aeU4WChIAkehACiEFsFRWGzLBSh4XB6AGr+J5-iAwSkVx6HAcxxqglWU6YUoRoieKXjUUY5H8fAPJCXetGiTRbL2jx-FJmxP4gDIQr2hRR6+KmWkmWRek0YZ6BMohd7BOZ-6WayNkcWhylGESqlAY5YYmVOBmGmw4nokYdlopBGFXFZloKRxukBVB6EeWFgVXK+76kAAkv4rhBJ+DraYUD4gAAtMVT5GKVepsJVkLVWVbn3hJj5KOFhTwbeHGFW2z7oW1LGEZ1l49Qmw3GK114sQCU5deyzVNa88GCXeM1Xr1mLjVhckFUNc3BQtVkdTUswNTV83HWNdVYcZ03fEap17edyCuvd4WVUZU3Lbdl0jdW3zBN9F0VWVRlLZ1X2-b13yvcDVnyZ98WfD9iOA58RnRfDDWPduUM9CocHyEAA"
	>Twinkle Twinkle Little Star</a>
<a
	href="/N4IgRgDgtiBcCMAmADAGhASwHYGcAuATgK5QCmWeOcoyy1IeAnhKXCDgPZFYAmAZhwoh0AC1IAPNgGYAwiAC+6ZPHpMWbTt36C8wkGMmwQyABwL0AMQurmrI5t4CKPYlCqiJbKwsWZchEnI8ABEiAgBDPAxBKlgaOlhkADopJRVEpPhfTiwAc3paegBjEXCsLFIAGwTjOnQSsorK9OMVetLyqsQ2ZG72xqqpHqH+zsqAFh7J32VijqaalD0GsZbENpAVpu6jRD7N+cG2RBGDgYmpn3QISLxSAlx6Jbjatng61reN3rf95CGjPBTshJoDJkoAKxvKFKABsb3BxgA7NC9KY3h9kABOL5ogCCvzRACE3kNfOsCjVxt8WuM-jsQONgQDGYiQWxxjDjFCjON4XCOVzkCjefzjGZed8cby-gTecCSbzpkoEvEMWiWvBvgykGiWUC0aCQPA2TzjUL4WC0SLzWiJcbMdLjd85ca-orjWS0pSOTSOfSOcyOWyjZy0Wa+WjLYyhTbI0p7dS0U66fjA8Tg+ZjKC1UYpJiWvm0Qyi0oWaXs9JMWaK8ho7WbbX7bWnbXXbWPUX5L5CGUcBAODhSAAFW73R4vZ657kanpChnIIUsxeGufhtdKG0rgVGbfijfGJ175Cu48elfk9LT48tY8LpcH9m7oVm4-R49boX249HoWnoXnlCMyqq8u6YgumJGoUMxXqBrzemBxY9HQ3bXCIERDrEoDvD6LyFEYMghmwhF2mwADibJyEYFFZrMcSoc6uHTniRFGCxpHUcqnz0UoOzAAxup4SB+EgBYrGiWy9oAKKUWwMm0VeMx8QJAK5tOwTiRpHEgCRAk5qB040UoRpGfuRhiWiVESVctpCbhIDycZcmSWwWkMUWdmeTpfz2sE3QwfZZEAMR-CZIXacFfxWZFNlJp504yF+clAb4qbxXBFhJUYUkpegTJMXBwRZTpuWsgVInsU5RhEi5BGlWG6UiTlq6cdpRWWeR0ypZaalwYlLUgKZ6LVbJrXdr4EDoeEQ4AJL+K4QRYQ69mFAhIAALTrUhRibXqbC7ZC+1bVV8FmadyBWdB6BaitkHIdpV1urdA2rWdr0XfdvgGl571QZi34odd+kib990JmDxiXYDtnXndiHg4hvgedO3gnajZ3ox95nWKlsEg98RoHW93xWbtqV8XBswnUTw2fEoro06TW2paplME0dD3fMEHNKEzWbjMDNRU5Wu7fN+JMc6lPLXuzoucx1cvdStst08TCufONQA"
	>Twinkle Twinkle Little Star Drums</a>
<button onclick={() => newSong()}>New song</button>
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
	class="bg-primary-400 dark:bg-primary-950 flex h-[500px] w-[500px] flex-col rounded-lg border-2 border-black text-black dark:text-white">
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
