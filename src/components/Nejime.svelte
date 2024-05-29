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
<p
	id="save-song-text"
	class="animate-custom-fade animate-duration-1050 mx-auto mt-80 rounded-md border-2 border-green-500 text-center"
	popover="auto"
	ontoggle={handlePopover}>
	Saved song to clipboard!
</p>
<a
	href="/N4IgRgDgtiBcCMAmADAGhASwHYGcAuATgK5QCmWeOcoyy1IeAnhKXCDgPZFYAmAZhwoh0AC1IAPNgGYAwiAC+6ZPHpMWbTt36C8wkGMmwQyABwL0AMQurmrI5t4CKPYlCqiJbKwsWZchEnI8ABEiAgBDPAxBKlgaOlhkADopJRVEpPhfTiwAc3paegBjEXCsLFIAGwTjOnQSsorK9OMVetLyqsQ2ZG72xqqpHqH+zsqAFh7J32VijqaalD0GsZbENpAVpu6jRD7N+cG2RBGDgYnj6d8ISLxSAlx6Jbjatng61reN3rf95CGjPBTshJoDJkoAKxvKFKABsb3BxgA7NC9KY3h9kABOL5ogCCvzRACE3kNfOsCjVxt8WuM-jsQONgQDGYiQWxxjDjFCjON4XCOVzkCjefzjGZed8cby-gTecCSbzpkoEvEMWiWvBvgykGiWUC0aCQPA2TzjUL4WC0SLzWiJcbMdLjd85ca-orjWS0pSOTSOfSOcyOWyjZy0Wa+WjLYyhTbI0p7dS0U66fjA8Tgz50IQyjgIBwcKQAAq3e6PF7PNVGZBClo1tEM+tKFlN4xG1v16uxnoWnt2vtKJ0d10dj318npKvcjUD4yNoUtoXtoVmjvRjs2jv2jtDoUjoVjqEzVWvauYxuY9t0GaT0+vb1nhs9a-XEQRQuxUDvH0vQpGGQhmwAH9kYADibJyGByqfHE8i+FqP5TnigFGMhIEgOB5gwcAMw7Dh8F4aeU4WChIAkehACiEFsFRWGzLBSh4XB6AGr+J5-iAwSkVx6HAcxxqglWU6YUoRoieKXjUUY5H8fAPJCXetGiTRbL2jx-FJmxP4gDIQr2hRR6+KmWkmWRek0YZ6BMohd7BOZ-6WayNkcWhylGESqlAY5YYmVOBmGmw4nokYdlopBGFXFZloKRxukBVB6EeWFgVXK+76kAAkv4rhBJ+DraYUD4gAAtMVT5GKVepsJVkLVWVbn3hJj5KOFhTwbeHGFW2z7oW1LGEZ1l49Qmw3GK114sQCU5deyzVNa88GCXeM1Xr1mLjVhckFUNc3BQtVkdTUswNTV83HWNdVYcZ03fEap17edyCuvd4WVUZU3Lbdl0jdW3zBN9F0VWVRlLZ1X2-b13yvcDVnyZ98WfD9iOA58RnRfDDWPduUM9CocHyEAA"
	>Twinkle Twinkle Little Star</a>
<a
	href="/N4IgRgDgtiBcCMAmADAGhASwHYGcAuATgK5QCmWeOcoyy1IeAnhKXCDgPZFYAmAZhwoh0AC1IAPNgGYAwiAC+6ZPHpMWbTt36C8wkGMmwQyABwL0AMQurmrI5t4CKPYlCqiJbKwsWZchEnI8ABEiAgBDPAxBKlgaOlhkADopJRVEpPhfTiwAc3paegBjEXCsLFIAGwTjOnQSsorK9OMVetLyqsQ2ZG72xqqpHqH+zsqAFh7J32VijqaalD0GsZbENpAVpu6jRD7N+cG2RBGDgYmpn3QISLxSAlx6Jbjatng61reN3rf95CGjPBTshJoDJkoAKxvKFKABsb3BxgA7NC9KY3h9kABOL5ogCCvzRACE3kNfOsCjVxt8WuM-jsQONgQDGYiQWxxjDjFCjON4XCOVzkCjefzjGZed8cby-gTecCSbzpkoEvEMWiWvBvgykGiWUC0aCQPA2TzjUL4WC0SLzWiJcbMdLjd85ca-orjWS0pSOTSOfSOcyOWyjZy0Wa+WjLYyhTbI0p7dS0U66fjA8Tg+ZjKC1UYpJiWvm0Qyi0oWaXs9JMWaK8ho7WbbX7bWnbXXbWPUX5L5CGUcBAODhSAAFW73R4vZ657kanpChnIIUsxeGufhtdKG0rgVGbfijfGJ175Cu48elfk9LT48tY8LpcH9m7oVm4-R49boX249HoWnoXnlCMyqq8u6YgumJGoUMxXqBrzemBxY9HQ3bXCIERDrEoDvD6LyFEYMghmwhF2mwADibJyEYFFZrMcSoc6uHTniRFGCxpHUcqnz0UoOzAAxup4SB+EgBYrGiWy9oAKKUWwMm0VeMx8QJAK5tOwTiRpHEgCRAk5qB040UoRpGfuRhiWiVESVctpCbhIDycZcmSWwWkMUWdmeTpfz2sE3QwfZZEAMR-CZIXacFfxWZFNlJp504yF+clAb4qbxXBFhJUYUkpegTJMXBwRZTpuWsgVInsU5RhEi5BGlWG6UiTlq6cdpRWWeR0ypZaalwYlLUgKZ6LVbJrXdr4EDoeEQ4AJL+K4QRYQ69mFAhIAALTrUhRibXqbC7ZC+1bVV8FmadyBWdB6BaitkHIdpV1urdA2rWdr0XfdvgGl571QZi34odd+kib990JmDxiXYDtnXndiHg4hvgedO3gnajZ3ox95nWKlsEg98RoHW93xWbtqV8XBswnUTw2fEoro06TW2paplME0dD3fMEHNKEzWbjMDNRU5Wu7fN+JMc6lPLXuzoucx1cvdStst08TCufONQA"
	>Twinkle Twinkle Little Star Drums</a>
<a
	href="/N4IgRgDgtiBcCMBmAHAGhASwHYGcAuATgK5QCmWeOcoADDdSHgJ4Slwg4D2RWAJgGacKIdAAtSAD3Y1EIAL7oAYoobNW7LjwFC8vYlCpjJ7ZfPQ14qlm1gdufQcKNTbAJgCsZkDVdX1tzQcdERBxFxAANl85BUxcQhJyPAARIgIAQzwMISpYWnpYGgA6RFiuLABzBjoGAGNRdKwsUgAbAu96dHrG5pbLW3hOkG6m1t83IZHe2VtESYbRloAWdiX6WIs6hd72za7t1v6QeEt9nrH2V1Phg5aZkERrqdaV2yXLGPQITLxSAlwGINqu0geYjicQj52PBfOZ7khIa9jitzJ4Bp5zBFoSjvAB2aEY7zIaFDGgATmh1xoAEFobDvAAhaGyWIQvIdEmQ8FU8bHekyZmI7GQtHHQk0LEDHE0fHoyHEgakikDKm0gb8pkDFnoVwFfKXUlHK6Q3mufn3VyycxI1zS0UeSGSkC2yGy53ihXOpWXVWXDWXbXO-r6iZcn0mv2Qi1W7w2u2XcVOl3mN0O8ye3WQ5VByFq53+tyBtbA1aG0sRt6k+7vIVvfmipb8p2N12rGM0T1LaXZ4vmPO9xmrD7oGvsmqVsMT8y8gcCt5UpEt1GrJsr1tvdud7vlvs7wfzrzjkMcsHSHnSc3SdtImjx2w0RPSaVuh-y6Te++++8F7yBzZj3Yy0-CtvEve9ryfEVpEfe9n2gt97w-bwv1AyFNV-eRYkIRocAgTgcFIAAFH4-gBdk2WPV9T3vcVeSojCaNrbxxVFeiJXglMOKJLjyR4vM2PQ19YmNACeKONi6PFe42JvFieKdNiXw9HjszY-jxUEzwNmDDkVUnY5zz0uFKSYiFlyM7wnTMvETPTWzvGzayaXsmh0IhDY9V07wAGF9JoXzp2kAKGJ8pj-Kg+9gvYyL11CuyYvMVSov4qLBN8z4QAgUQMgI3JQCBUTCpAbz+U9ABRaJWR0o8vMUUr2AqzD0BhEsiuSerbBKprjhmENj2pBd2AZKlPS6jL4FePqvMa612AAcSpXzbAWhCQHa7r4DRKbb3mxbdshdouvikBhu6zNCuPbzlM6rTqOPMrrpAB6zuqzzx2Kx6rsParyvFdpFC04Txm2w7Ptu5DWrWx7noyy1WsusHvshgGmOSaHAZ1SbdNoJE5ulJaQDxpGxyRBl8aGlYNmB2N5vFAm5ox914Zp5bydZ4mcfYL7zAJsnD2pnblrp2nuuLC6vNO7Tqk9daqeRgBifkkUURXVpV-kCfV0XXsh07ZtsSW7u42xZcCoqtf1kALeN4r5fbAnqVVjKW3F97DYhscZeiM3jzm1WzcJ-2WZAR2OsD-k8z9jX2FD0XeuxiXhw92gvf56Wubtg75qDqFlpzpFY42ePwpN9tki59syqG-kVFsalKpHLGardpP-xT9hTdQorqQg2xrY7Ewc81p2POZ97vOlJEJ9Womefmym7rlvIMrbhP3upSeY+lT0iZXgW3v+ze++3hq2aeymi7H9pkiPtaT86i-9ZB+emNnm3FDPj-utfV32jK2--6rRvphWIWUcqkAAJLxH0EkPKxwD5nlWpsKqkM9g22Qc1feiDjoYJ6qgwawEcFJwmvgiKIAAC05Cwp7UIeg4hW1g5oJLhDcwuwRqIOEgg78TFKFIO9jmIqUIcH8LNKgsOUJhLF12ErC8fCvAuhJrIue3DhIMMFqhZRqFYhi2PKYY6ejg4GOYaYbROs+4qH0RYwxVjjEqG0Vg8xasbHKxsbyIxeYjGazsSOKRJgbGek8X4yE5dHHmCrqE7wtcrauKCZbExjdkb+NidYyEXjDxcJPIw0knoajmBCRQqhmjcnMXYLwqWgjSQ3mye+NOFSwrVMQqkmpl86mW2KQPRpGwm6AXqUg0kBMagbDUT0tpDSOQxDkEAA"
	>Demo</a>
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
