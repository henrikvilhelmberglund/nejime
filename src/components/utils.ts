import {
	context,
	createBpmState,
	createIntervalIdState,
	createPhrasesState,
	createPlayPositionState,
	marimba
} from "./globalState.svelte";

export function toHex(input: number) {
	return input.toString(16).toUpperCase().padStart(2, "0");
}

export function toHexSingle(input: number) {
	return input.toString(16).toUpperCase().padStart(1, "0");
}

export function addSpace(input: string) {
	if (input.length === 2) {
		let newInput = `${input[0]}&nbsp;&nbsp;${input[1]}`;
		input = newInput;
	}
	return input;
}

function addSilentNotes(object: Record<string, Record<string, string>>) {
	const notes = object;
	const numberOfNotes = 16;
	const channels = ["00", "01", "02", "03", "04"];
	console.log("before", notes);
	channels.forEach((channel) => {
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
	console.log("after", notes);
	return notes;
}

export function play(state: string, hex: string) {
	const bpmState = createBpmState();
	const playPositionState = createPlayPositionState();
	const intervalIdState = createIntervalIdState();
	console.log("state", state);
	if (state === "phrase") {
		// marimba.start("C3");
		let phrasesState = createPhrasesState();
		const channels = ["00", "01", "02", "03", "04"];
		const now = context.currentTime;
		let notes = phrasesState.value?.[hex as keyof typeof phrasesState.value];
		notes = addSilentNotes(notes);
		channels.forEach((channel) => {
			for (let i = 0; i < 16; i++) {
				const note = notes[channel][toHex(i)];
				marimba.start({
					note,
					time: now + i * (60 / (bpmState.value * 4)),
					duration: 60 / (bpmState.value * 4)
					// onEnded: () => {
					// 	// will be called after 1 second
					// 	console.log("ended");
					// }
				});
			}
		});
	}
}

export function stop(state: string) {
	const bpmState = createBpmState();
	const playPositionState = createPlayPositionState();
	const intervalIdState = createIntervalIdState();
	console.log("state", state);
	if (state === "phrase") {
		// marimba.start("C3");
		let phrasesState = createPhrasesState();
		// let activePhrase = createActivePhraseState();
		const channels = ["00", "01", "02", "03", "04"];
		const now = context.currentTime;
		marimba.stop();
	}
}
