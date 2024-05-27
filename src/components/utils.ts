import type { Pattern } from "../types/types";
import {
	bpm,
	instrumentDurations,
	createIntervalIdState,
	lastPatternHex,
	patterns,
	phraseInstruments,
	phrases,
	// createPlayPositionPhraseState,
	createPlayPositionsPatternsState,
	createPlayPositionsPhrasesState,
	createPlayPositionsSongState,
	song,
	transposePatterns,
	// createInstrumentsState,
	// createContextState
	instruments,
	context
} from "./globalState.svelte";

export function toHex(input: number) {
	return input.toString(16).toUpperCase().padStart(2, "0");
}

export function toHexSingle(input: number) {
	return input.toString(16).toUpperCase().padStart(1, "0");
}

export function toInt(input: string) {
	return parseInt(input, 16);
}

export function toIntFromTranspose(input: string) {
	console.log("input", input);
	if (parseInt(input, 16) > 128) {
		return (256 - parseInt(input, 16)) * -1;
	} else {
		return parseInt(input, 16);
	}
}

export function noteToInt(input: string) {
	const octave = parseInt(input[input.length - 1]);
	const note = input.split(octave.toString())[0];
	const notes = ["C", "C#", "D", "D#", "E", "F", "F#", "G", "G#", "A", "A#", "B"];
	const offset = 12;
	const output = notes.indexOf(note) + octave * 12 + offset;
	return output;
}

export function addSpace(input: string) {
	if (input.length === 2) {
		let newInput = `${input[0]}&nbsp;&nbsp;${input[1]}`;
		input = newInput;
	}
	return input;
}

function addSilentNotes(object: Record<string, Record<string, string>>) {
	let notes = object;
	const numberOfNotes = 16;
	const channels = ["00", "01", "02", "03", "04"];
	channels.forEach((channel) => {
		if (!notes) {
			notes = {}; // Initialize the channel if it doesn't exist
		}
		if (!notes[channel]) {
			notes[channel] = {}; // Initialize the channel if it doesn't exist
		}
		for (let i = 0; i < numberOfNotes; i++) {
			if (!notes[channel]?.[toHex(i)]) {
				notes[channel][toHex(i)] = "---";
				// console.log(notes[channel]?.[toHex(i)]);
			}
		}
	});
	return notes;
}

// ? this caused wrong notes to be played when you edited a pattern while playing back because the notes were queued when the interval started
// export function play(state: string, hex: string) {
// 	const bpmState = createBpmState();
// 	const playPositionState = createPlayPositionState();
// 	const intervalIdState = createIntervalIdState();
// 	console.log("state", state);
// 	if (state === "phrase") {
// 		// marimba.start("C3");
// 		let phrasesState = createPhrasesState();
// 		const channels = ["00", "01", "02", "03", "04"];
// 		const now = context.currentTime;
// 		let notes = phrasesState.value?.[hex as keyof typeof phrasesState.value];
// 		notes = addSilentNotes(notes);
// 		channels.forEach((channel) => {
// 			for (let i = 0; i < 16; i++) {
// 				const note = notes[channel][toHex(i)];
// 				marimba.start({
// 					note,
// 					time: now + i * (60 / (bpmState.value * 4)),
// 					duration: 60 / (bpmState.value * 4)
// 					// onEnded: () => {
// 					// 	// will be called after 1 second
// 					// 	console.log("ended");
// 					// }
// 				});
// 			}
// 		});
// 	}
// }

export function playPhraseFromSong(state: string, hex: string, i: number, transpose: Pattern) {
	const playPositionsPhrases = createPlayPositionsPhrasesState();
	const playPositionsPatterns = createPlayPositionsPatternsState();
	// const instruments = createInstrumentsState();
	// const context = createContextState();

	// console.log("state", state);
	if (
		(state === "phrase" ||
			state === "pattern" ||
			state === "song" ||
			state === "project-song" ||
			state === "instrument") &&
		context.value
	) {
		// marimba.start("C3");
		const channels = ["00", "01", "02", "03", "04"];
		const now = context.value.currentTime;
		let notes = phrases.value?.[hex as keyof typeof phrases.value];
		let playbackInstruments = phraseInstruments.value?.[hex as keyof typeof phrases.value];

		// TODO play next pattern when pattern increases
		// notes = addSilentNotes(notes);
		channels.forEach((channel) => {
			let note;
			try {
				note = notes[channel][toHex(playPositionsPhrases.value[i])];
			} catch (error) {}
			if (note && instruments.value) {
				const instrument =
          instruments.value[playbackInstruments?.[toHex(playPositionsPhrases.value[i])] ?? "00"];
        // TODO implement removing of playing notes if another note appears on same channel
				const duration =
					instrumentDurations.value?.[
						playbackInstruments?.[toHex(playPositionsPhrases.value?.[i])]
					] ?? bpm.value / 60 / 4;
				// console.info(transpose);
				// instrument.stop();
				if (instrument.sound) {
					instrument.sound.start({
						note:
							noteToInt(note) +
							toIntFromTranspose(
								transpose[toHex(playPositionsPatterns.value[i])] ?
									transpose[toHex(playPositionsPatterns.value[i])]
								:	"00"
							),
						// note,
						time: now,
						duration: duration
					});
				}
				// setTimeout(
				// 	() => {
				// 		stopNote();
				// 	},
				// 	duration / 1000 / (bpmState.value * 4)
				// );
			}
		});
	}
}

export function playPhrase(state: string, hex: string) {
	// const playPositionPhrase = createPlayPositionPhraseState();
	const playPositionsPhrases = createPlayPositionsPhrasesState();
	const playPositionsPatterns = createPlayPositionsPatternsState();
	// const instruments = createInstrumentsState();
	// const context = createContextState();
	// const playPositionPattern = createPlayPositionPatternState();
	const intervalIdState = createIntervalIdState();
	// console.log("state", state);
	if ((state === "phrase" || state === "pattern" || state === "instrument") && context.value) {
		// marimba.start("C3");
		let transpose = state === "pattern" ? true : false;
		const channels = ["00", "01", "02", "03", "04"];
		const now = context.value.currentTime;
		let notes = phrases.value?.[hex as keyof typeof phrases.value];
		let playbackInstruments = phraseInstruments.value?.[hex as keyof typeof phrases.value];
		// notes = addSilentNotes(notes);
		channels.forEach((channel) => {
			let note;
			try {
				note = notes[channel][toHex(playPositionsPhrases.value["0"])];
			} catch (error) {}
			if (note && instruments.value) {
				const instrument =
          instruments.value[playbackInstruments?.[toHex(playPositionsPhrases.value["0"])] ?? "00"];
        // TODO implement removing of playing notes if another note appears on same channel
				const duration =
					instrumentDurations.value?.[
						playbackInstruments?.[toHex(playPositionsPhrases.value?.["0"])]
					] ?? bpm.value / 60 / 4;
				// console.info(instrument);
				// instrument.stop();
				// console.table([transposePatterns.value, lastPatternHex.value, playPositionsPatterns.value[0]])
				if (instrument.sound) {
					instrument.sound.start({
						note:
							transpose ?
								noteToInt(note) +
								toIntFromTranspose(
									transposePatterns.value?.[lastPatternHex.value]?.[
										toHex(playPositionsPatterns.value[0])
									] ?? "00"
								)
							:	noteToInt(note),
						// note,
						time: now,
						duration: duration
					});
				}
				// setTimeout(
				// 	() => {
				// 		stopNote();
				// 	},
				// 	duration / 1000 / (bpmState.value * 4)
				// );
			}
		});
	}
}

export function stop(state: string) {
	const intervalIdState = createIntervalIdState();
	// const instruments = createInstrumentsState();
	// const context = createContextState();

	console.log("state", state);
	if (state === "phrase" && context.value && instruments.value) {
		// marimba.start("C3");
		// let activePhrase = createActivePhraseState();
		const channels = ["00", "01", "02", "03", "04"];
		const now = context.value.currentTime;
		// marimba.stop();
		// instrument.start({ note: selectedNote });
		Object.values(instruments.value).forEach((instrument) => {
			if (instrument.sound) {
				instrument.sound.stop();
			}
		});
	}
}
