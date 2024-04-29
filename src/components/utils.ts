import {
	context,
	createBpmState,
	createInstrumentDurationsState,
	createInstrumentsState,
	createIntervalIdState,
	createLastPatternHexState,
	createPatternsState,
	createPhraseInstrumentsState,
	createPhrasesState,
	createPlayPositionPhraseState
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
				console.log(notes[channel]?.[toHex(i)]);
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

export function playPhrase(state: string, hex: string) {
	const bpmState = createBpmState();
	const playPositionPhrase = createPlayPositionPhraseState();
	const intervalIdState = createIntervalIdState();
	const soundfonts = createInstrumentsState();
	const instrumentDurations = createInstrumentDurationsState();
	const phraseInstruments = createPhraseInstrumentsState();
	console.log("state", state);
	if (state === "phrase" || state === "pattern") {
		// marimba.start("C3");
		let phrasesState = createPhrasesState();
		const channels = ["00", "01", "02", "03", "04"];
		const now = context.currentTime;
		let notes = phrasesState.value?.[hex as keyof typeof phrasesState.value];
		let instruments = phraseInstruments.value?.[hex as keyof typeof phrasesState.value];
		notes = addSilentNotes(notes);
		channels.forEach((channel) => {
			const note = notes[channel][toHex(playPositionPhrase.value)];
			const instrument = soundfonts.value[instruments?.[toHex(playPositionPhrase.value)] ?? "00"];
			const duration =
				instrumentDurations.value[instruments?.[toHex(playPositionPhrase.value)] ?? "00"];
			console.log("duration", duration);
			// console.info(instrument);
			if (note !== "---") {
				console.log("note", note);
				// instrument.stop();
				instrument.start({
					note,
					time: now,
					duration: duration
				});
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
	const bpmState = createBpmState();
	const playPositionPhrase = createPlayPositionPhraseState();
	const intervalIdState = createIntervalIdState();
	const soundfonts = createInstrumentsState();

	console.log("state", state);
	if (state === "phrase") {
		// marimba.start("C3");
		let phrasesState = createPhrasesState();
		// let activePhrase = createActivePhraseState();
		const channels = ["00", "01", "02", "03", "04"];
		const now = context.currentTime;
		// marimba.stop();
		// instrument.start({ note: selectedNote });
		Object.values(soundfonts.value).forEach((soundfont) => {
			soundfont.stop();
		});
	}
}
