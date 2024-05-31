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
	import FancyButton from "./FancyButton.svelte";
	import { versionNumber } from "$lib/metadata.svelte";

	let allStates = ["song", "pattern", "phrase", "instrument", "project-song", "project-pattern"];

	let focusedElement = $state();

	// function getCurrentActiveElement() {
	//   return document.activeElement
	// }

	let showTutorial = $state(false);
	let showInfo = $state(false);

	function restoreFocus() {
		let activeElement = document.activeElement;
		setTimeout(() => {
			activeElement.focus();
		}, 0);
	}

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

{#snippet arrowKey(classes, code)}
	<button
		ontouchstart={(e) => {
    document.activeElement!.dispatchEvent(
        new KeyboardEvent("keydown", { code, bubbles: true })
      );
      focusedElement = document.activeElement;
    }}
		class="{classes} h-18 w-18"></button>
{/snippet}

<div class="flex w-[100%] justify-center">
	<div
		id="info"
		class:invisible={!showInfo}
		class="z-1000 absolute w-[85%] flex-col rounded border border-black bg-slate-100 p-1 text-black lg:static lg:flex lg:h-[370px] lg:h-[500px] lg:w-[500px] dark:bg-slate-950 dark:text-white">
		<p class="text-lg">Welcome to Nejime {versionNumber}!</p>
		<br />
		<p>Nejime is a music tracker made for creating and sharing music.</p>
		<p>It is heavily WIP and unstable right now but still possibly interesting.</p>
		<p>I hope you like it! 😊</p>
		<p>To report bugs/issues, go to</p>

		<a
			class="underline-blue-500 block flex w-40 items-center underline"
			href="https://github.com/henrikvilhelmberglund/nejime/issues">
			<div class="i-carbon-logo-github h-6 w-6"></div>
			<span>Nejime</span>
		</a>
		<p></p>
	</div>
	<main
		tabindex="-1"
		id="nejime"
		role="presentation"
		onkeydown={(e) => handleKeyDown(e)}
		onclick={(e) => {
      // console.log(e.target.type)
      if (!e.target.type)
			document.querySelector<HTMLButtonElement>("#nejime button")!.focus();
		}}
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
		class="bg-primary-400 dark:bg-primary-950 flex h-[370px] w-[85%] flex-col rounded border border-black text-black lg:h-[500px] lg:w-[500px] dark:text-white">
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
	</main>
	<div
		id="tutorial"
		class:invisible={!showTutorial}
		class="z-1000 absolute w-[85%] flex-col rounded border border-black bg-slate-100 p-1 text-black lg:static lg:flex lg:h-[370px] lg:h-[500px] lg:w-[500px] dark:bg-slate-950 dark:text-white">
		<div class="hidden lg:block">
			<p class="text-lg">Tutorial</p>
			<br />
			<p>Click within the blue square to focus a value.</p>
			<p>Use arrow keys to move the cursor.</p>
			<p>Press Spacebar to play the song.</p>
			<p>Press S and arrow keys to change the active view.</p>
			<p>Press F to add a value.</p>
			<p>Press F and arrow keys to change the active value.</p>
			<p>Press D and F to remove a value.</p>
			<br />
			<p>In a phrase go beyond the bottom or top to go to the next/previous phrase.</p>
			<p>
				In a phrase press S+↑ to switch the active instrument for the selected instrument number.
			</p>
			<br />
			<p>Save the song using the Save icon at the bottom to get a shareable link.</p>
		</div>
		<div class="block lg:hidden">
			<p class="text-lg">Tutorial</p>
			<br />
			<p>Press within the blue square to focus a value.</p>
			<p>Use the arrow buttons to move the cursor.</p>
			<p>Press the Play button to play the song.</p>
			<p>Press C and arrow buttons to change the active view.</p>
			<p>Press the A button to add a value.</p>
			<p>Press the A button and arrow buttons to change the active value.</p>
			<p>Press the B button to remove a value.</p>
			<br />
			<p>In a phrase go beyond the bottom or top to go to the next/previous phrase.</p>
			<p>
				In a phrase press B+↑ to switch the active instrument for the selected instrument number.
			</p>
			<br />
			<p>Save the song using the Save icon at the bottom to get a shareable link.</p>
		</div>
	</div>
</div>

<div
	tabindex="0"
	onmousedown={(e) => {
		e.preventDefault();
	}}
	oncontextmenu={(e) => {
		// e.preventDefault();
		// e.stopPropagation();
		// e.stopImmediatePropagation();
		// return false;
		focusedElement.focus();
	}}
	role="button"
	class="mt-4 flex w-full justify-between lg:hidden">
	<div
		tabindex="0"
		role="button"
		onmousedown={(e) => {
			e.preventDefault();
		}}
		class="my-grid justify-start">
		<!-- <button
			ontouchstart={(e) => {
      document.activeElement!.dispatchEvent(
        new KeyboardEvent("keydown", { code: "ArrowUp", bubbles: true })
      );
      focusedElement = document.activeElement;
    }}
			class="i-carbon-arrow-up grid-area-header h-18 w-18"></button> -->
		{@render arrowKey("i-carbon-arrow-up grid-area-up", "ArrowUp")}
		{@render arrowKey("i-carbon-arrow-left grid-area-left", "ArrowLeft")}
		{@render arrowKey("i-carbon-arrow-right grid-area-right", "ArrowRight")}
		{@render arrowKey("i-carbon-arrow-down grid-area-down", "ArrowDown")}
	</div>
	<button
		onclick={() => {
    document.querySelector("#nejime")!.dispatchEvent(
      new KeyboardEvent("keydown", { code: "Space", bubbles: true })
    );
  }}
		class="absolute left-[50%] translate-x-[-25%] rounded-full bg-slate-300 px-6 py-3">Play</button>
	<div
		tabindex="0"
		onmousedown={(e) => {
			e.preventDefault();
		}}
		role="button"
		class="mr-6 flex flex-col items-center gap-2 text-5xl">
		<!-- <FancyButton /> -->
		<button
			ontouchstart={(e) => {
        fPressed.value = true;
        // ? avoid losing focus on mobile longpress
        focusedElement = document.activeElement;
        console.log(focusedElement)
        document.activeElement!.dispatchEvent(
        new KeyboardEvent("keydown", { code: "KeyF", bubbles: true })
      );
    }}
			ontouchend={() => {
				fPressed.value = false;
			}}
			class="rounded-full bg-slate-300 px-4 py-2">A</button>
		<button
			ontouchstart={(e) => {
        dPressed.value = true;
        focusedElement = document.activeElement;
        document.activeElement!.dispatchEvent(
        new KeyboardEvent("keydown", { code: "KeyD", bubbles: true })
      );
        document.activeElement!.dispatchEvent(
        new KeyboardEvent("keydown", { code: "KeyF", bubbles: true })
      );
    }}
			ontouchend={() => {
				dPressed.value = false;
				fPressed.value = false;
			}}
			class="rounded-full bg-slate-300 px-4 py-2">B</button>
		<button
			ontouchstart={(e) => {
        sPressed.value = true;
        focusedElement = document.activeElement;
        document.activeElement!.dispatchEvent(
        new KeyboardEvent("keydown", { code: "KeyS", bubbles: true })
      );
    }}
			ontouchend={() => {
				sPressed.value = false;
			}}
			class="rounded-full bg-slate-300 px-4 py-2">C</button>
	</div>
</div>

<!-- <div class="my-2"></div> -->
<Buttons
	onShowTutorial={() => (showTutorial = !showTutorial)}
	onShowInfo={() => (showInfo = !showInfo)} />

<style>
	.my-grid {
		display: grid;
		grid-template-areas:
			". up ."
			"left . right"
			". down .";
	}
</style>
