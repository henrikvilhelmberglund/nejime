import type { Soundfont } from "smplr";
import {
	createActiveScreenState,
	createBpmState,
	createInstrumentsState,
	createLastPatternHexState,
	createLastPhraseHexState,
	createLastTouchedNoteState,
	createLastTouchedPatternState,
	createLastTouchedPhraseState,
	createPatternsState,
	createPhrasesState,
	createSongState,
	createTransposePatternsState
} from "./globalState.svelte";
import { toHex, toInt } from "./utils";

let activeScreen = createActiveScreenState();
let lastPatternHex = createLastPatternHexState();
let lastPhraseHex = createLastPhraseHexState();
let lastTouchedPattern = createLastTouchedPatternState();
let lastTouchedPhrase = createLastTouchedPhraseState();
let lastTouchedNote = createLastTouchedNoteState();
let song = createSongState();
let patterns = createPatternsState();
let transposePatterns = createTransposePatternsState();
let phrases = createPhrasesState();
const notes = ["C", "C#", "D", "D#", "E", "F", "F#", "G", "G#", "A", "A#", "B"];

type addProps = {
	element: HTMLButtonElement;
};

export function add({ element }: addProps) {
	if (activeScreen.value === "song") {
		const row = element.id.split("row")[1].split("-channel")[0];
		const channel = element.id.split("-")[1];
		console.log("channel", channel);

		if (element.innerText === "--") {
			console.log("new pattern here");

			// initialize empty object if they do not exist
			if (!song.value) {
				song.value = {};
			}

			if (!song.value[toHex(+row)]) {
				song.value[toHex(+row)] = {};
			}

			if (!song.value[toHex(+row)][channel]) {
				song.value[toHex(+row)][channel] = "";
			}

			// lastPhraseHex

			// console.log(phrases.value[lastPatternHex.value]);

			song.value[toHex(+row)][channel] = lastTouchedPattern.value;
		} else {
		}
	}

	if (activeScreen.value === "pattern") {
		const row = element.id.split("row")[1].split("-pattern")[0];
		const pattern = element.id.split("row")[1].split("-pattern")[1];

		if (element.innerText === "--") {
			console.log("new phrase here");

			// initialize empty object if they do not exist
			if (!patterns.value) {
				patterns.value = {};
			}
			if (!patterns.value[lastPatternHex.value]) {
				patterns.value[lastPatternHex.value] = {};
			}
			if (!patterns.value[lastPatternHex.value][toHex(+row)]) {
				patterns.value[lastPatternHex.value][toHex(+row)] = "";
			}

			// lastPhraseHex

			// console.log(phrases.value[lastPatternHex.value]);

			patterns.value[lastPatternHex.value][toHex(+row)] = lastTouchedPhrase.value;
		} else {
		}
	}

	if (activeScreen.value === "phrase") {
		const row = element.id.split("note")[1].split("-channel")[0];
		const channel = element.id.split("note")[1].split("-channel")[1];

		if (element.innerText === "---") {
			console.log("new note here");

			// initialize empty object if they do not exist
			if (!phrases.value) {
				phrases.value = {};
			}
			if (!phrases.value[lastPhraseHex.value]) {
				phrases.value[lastPhraseHex.value] = {};
			}
			if (!phrases.value[lastPhraseHex.value][toHex(+channel)]) {
				phrases.value[lastPhraseHex.value][toHex(+channel)] = {};
			}

			phrases.value[lastPhraseHex.value][toHex(+channel)][toHex(+row)] = lastTouchedNote.value;
		} else {
		}
	}
}

type previewProps = {
	element: HTMLButtonElement;
	instrument: Soundfont;
};

export function preview({ element, instrument }: previewProps) {
	const bpmState = createBpmState();
	const row = element.id.split("note")[1].split("-channel")[0];
	const channel = element.id.split("note")[1].split("-channel")[1];

	let selectedNote = phrases.value[lastPhraseHex.value]?.[toHex(+channel)]?.[toHex(+row)];
	if (selectedNote === undefined) return;
	// marimba.start({ note: selectedNote });
	instrument.stop();
	instrument.start({ note: selectedNote });
	// setTimeout(
	//   () => {
	//     instrument.stop();
	//   },
	//   (duration * 1000) / (bpmState.value * 4)
	// );
}

type editProps = {
	direction: string;
	element: HTMLButtonElement;
};

export function stopNotePreview({ element, instrument }: previewProps) {
	instrument.stop();
}

export function edit({ direction, element }: editProps) {
	if (activeScreen.value === "song") {
		const row = element.id.split("row")[1].split("-channel")[0];
		const channel = element.id.split("-")[1];
		let selectedPattern = element.innerText;
		console.table({ row, channel, selectedPattern });
		if (selectedPattern === undefined) return;
		// const selectedPhraseTone = selectedPattern.split(selectedPattern[selectedPattern.length - 1])[0];
		let newPhrase;
		if (direction === "right") {
			if (selectedPattern === "FF") {
				selectedPattern = "00";
				song.value[toHex(+row)][channel] = `${toHex(toInt(selectedPattern))}`;
			} else {
				song.value[toHex(+row)][channel] = `${toHex(toInt(selectedPattern) + 1)}`;
			}
		} else if (direction === "left") {
			if (selectedPattern === "00") {
				selectedPattern = "FF";
				song.value[toHex(+row)][channel] = `${toHex(toInt(selectedPattern))}`;
			} else {
				song.value[toHex(+row)][channel] = `${toHex(toInt(selectedPattern) - 1)}`;
			}
		} else if (direction === "up") {
			if (toInt(selectedPattern) > 243) {
				song.value[toHex(+row)][channel] = `${toHex(toInt(selectedPattern) - 256 + 12)}`;
			} else {
				song.value[toHex(+row)][channel] = `${toHex(toInt(selectedPattern) + 12)}`;
			}
		} else if (direction === "down") {
			if (toInt(selectedPattern) < 12) {
				song.value[toHex(+row)][channel] = `${toHex(toInt(selectedPattern) + 256 - 12)}`;
			} else {
				song.value[toHex(+row)][channel] = `${toHex(toInt(selectedPattern) - 12)}`;
			}
		}
		// ensure we get the updated value
		setTimeout(() => {
			lastTouchedPattern.value = (<HTMLButtonElement>document.activeElement).innerText;
		}, 0);
	}

	if (activeScreen.value === "pattern") {
		const row = element.id.split("row")[1].split("-pattern")[0];
		const pattern = lastPatternHex.value;
		let selectedPhrase = element.innerText;
		console.table({ row, pattern, selectedPhrase });
		if (selectedPhrase === undefined) return;
		// const selectedPhraseTone = selectedPhrase.split(selectedPhrase[selectedPhrase.length - 1])[0];
		let newPhrase;
		if (direction === "right") {
			if (selectedPhrase === "FF") {
				selectedPhrase = "00";
				patterns.value[lastPatternHex.value][toHex(+row)] = `${toHex(toInt(selectedPhrase))}`;
			} else {
				patterns.value[lastPatternHex.value][toHex(+row)] = `${toHex(toInt(selectedPhrase) + 1)}`;
			}
		} else if (direction === "left") {
			if (selectedPhrase === "00") {
				selectedPhrase = "FF";
				patterns.value[lastPatternHex.value][toHex(+row)] = `${toHex(toInt(selectedPhrase))}`;
			} else {
				patterns.value[lastPatternHex.value][toHex(+row)] = `${toHex(toInt(selectedPhrase) - 1)}`;
			}
		} else if (direction === "up") {
			if (toInt(selectedPhrase) > 243) {
				patterns.value[lastPatternHex.value][toHex(+row)] =
					`${toHex(toInt(selectedPhrase) - 256 + 12)}`;
			} else {
				patterns.value[lastPatternHex.value][toHex(+row)] = `${toHex(toInt(selectedPhrase) + 12)}`;
			}
		} else if (direction === "down") {
			if (toInt(selectedPhrase) < 12) {
				patterns.value[lastPatternHex.value][toHex(+row)] =
					`${toHex(toInt(selectedPhrase) + 256 - 12)}`;
			} else {
				patterns.value[lastPatternHex.value][toHex(+row)] = `${toHex(toInt(selectedPhrase) - 12)}`;
			}
		}
		// ensure we get the updated value
		setTimeout(() => {
			lastTouchedPhrase.value = (<HTMLButtonElement>document.activeElement).innerText;
		}, 0);
	}

	if (activeScreen.value === "phrase") {
		// TODO support instrument selector here
		const row = element.id.split("note")[1].split("-channel")[0];
		const channel = element.id.split("note")[1].split("-channel")[1];
		let selectedNote = phrases.value[lastPhraseHex.value]?.[toHex(+channel)]?.[toHex(+row)];
		if (selectedNote === undefined) return;
		const selectedNoteTone = selectedNote.split(selectedNote[selectedNote.length - 1])[0];
		const selectedNoteOctave = selectedNote[selectedNote.length - 1];
		let newNoteTone;
		let newNoteOctave;

		if (direction === "right") {
			// console.log(row, channel);
			if (notes.indexOf(selectedNoteTone) === notes.length - 1) {
				if (+selectedNoteOctave > 6) return;
				newNoteTone = "C";
				newNoteOctave = +selectedNoteOctave + 1;
				phrases.value[lastPhraseHex.value][toHex(+channel)][toHex(+row)] =
					`${newNoteTone}${newNoteOctave}`;
			} else {
				newNoteTone = notes[notes.indexOf(selectedNoteTone) + 1];
				newNoteOctave = +selectedNoteOctave;
				phrases.value[lastPhraseHex.value][toHex(+channel)][toHex(+row)] =
					`${newNoteTone}${newNoteOctave}`;
			}
		} else if (direction === "left") {
			if (notes.indexOf(selectedNoteTone) === 0) {
				if (+selectedNoteOctave <= 0) return;
				newNoteTone = "B";
				newNoteOctave = +selectedNoteOctave - 1;
				phrases.value[lastPhraseHex.value][toHex(+channel)][toHex(+row)] =
					`${newNoteTone}${newNoteOctave}`;
			} else {
				newNoteTone = notes[notes.indexOf(selectedNoteTone) - 1];
				newNoteOctave = +selectedNoteOctave;
				phrases.value[lastPhraseHex.value][toHex(+channel)][toHex(+row)] =
					`${newNoteTone}${newNoteOctave}`;
			}
		} else if (direction === "up") {
			if (+selectedNoteOctave > 6) return;
			newNoteTone = selectedNoteTone;
			newNoteOctave = +selectedNoteOctave + 1;
			phrases.value[lastPhraseHex.value][toHex(+channel)][toHex(+row)] =
				`${newNoteTone}${newNoteOctave}`;
		} else if (direction === "down") {
			if (+selectedNoteOctave <= 0) return;
			newNoteTone = selectedNoteTone;
			newNoteOctave = +selectedNoteOctave - 1;
			phrases.value[lastPhraseHex.value][toHex(+channel)][toHex(+row)] =
				`${newNoteTone}${newNoteOctave}`;
		}

		// ensure we get the updated value
		setTimeout(() => {
			lastTouchedNote.value = (<HTMLButtonElement>document.activeElement).innerText.replaceAll(
				// ! this is probably stupid but it works (C  3 turns into C3 etc)
				" ",
				""
			);
		}, 0);
	}
}

export function editTranspose({ direction, element }: editProps) {
	if (activeScreen.value === "pattern") {
		const row = element.id.split("row")[1].split("-transpose")[0];
		const pattern = lastPatternHex.value;
		// const transposePatterns
		let selectedPhrase = element.innerText;
		console.table({ row, pattern, selectedPhrase });
		if (selectedPhrase === undefined) return;
		// const selectedPhraseTone = selectedPhrase.split(selectedPhrase[selectedPhrase.length - 1])[0];
		let newPhrase;
		if (direction === "right") {
			if (selectedPhrase === "FF") {
				selectedPhrase = "00";
				transposePatterns.value[lastPatternHex.value][toHex(+row)] =
					`${toHex(toInt(selectedPhrase))}`;
			} else {
				transposePatterns.value[lastPatternHex.value][toHex(+row)] =
					`${toHex(toInt(selectedPhrase) + 1)}`;
			}
		} else if (direction === "left") {
			if (selectedPhrase === "00") {
				selectedPhrase = "FF";
				transposePatterns.value[lastPatternHex.value][toHex(+row)] =
					`${toHex(toInt(selectedPhrase))}`;
			} else {
				transposePatterns.value[lastPatternHex.value][toHex(+row)] =
					`${toHex(toInt(selectedPhrase) - 1)}`;
			}
		} else if (direction === "up") {
			if (toInt(selectedPhrase) > 243) {
				transposePatterns.value[lastPatternHex.value][toHex(+row)] =
					`${toHex(toInt(selectedPhrase) - 256 + 12)}`;
			} else {
				transposePatterns.value[lastPatternHex.value][toHex(+row)] =
					`${toHex(toInt(selectedPhrase) + 12)}`;
			}
		} else if (direction === "down") {
			if (toInt(selectedPhrase) < 12) {
				transposePatterns.value[lastPatternHex.value][toHex(+row)] =
					`${toHex(toInt(selectedPhrase) + 256 - 12)}`;
			} else {
				transposePatterns.value[lastPatternHex.value][toHex(+row)] =
					`${toHex(toInt(selectedPhrase) - 12)}`;
			}
		}
		// ensure we get the updated value
		setTimeout(() => {
			lastTouchedPhrase.value = (<HTMLButtonElement>document.activeElement).innerText;
		}, 0);
	}
}

type deleteProps = {
	element: HTMLButtonElement;
};

export function remove({ element }: deleteProps) {
	if (activeScreen.value === "song") {
		const row = element.id.split("row")[1].split("-channel")[0];
		const channel = element.id.split("-")[1];
		song.value[toHex(+row)][channel] = `--`;
	}

	if (activeScreen.value === "pattern") {
		const row = element.id.split("row")[1].split("-pattern")[0];
		const pattern = element.id.split("row")[1].split("-pattern")[1];
		patterns.value[lastPatternHex.value][toHex(+row)] = `--`;
	}

	if (activeScreen.value === "phrase") {
		const row = element.id.split("note")[1].split("-channel")[0];
		const channel = element.id.split("note")[1].split("-channel")[1];
		phrases.value[lastPhraseHex.value][toHex(+channel)][toHex(+row)] = `---`;
	}
}

export function removeTranspose({ element }: deleteProps) {
	if (activeScreen.value === "pattern") {
		const row = element.id.split("row")[1].split("-transpose")[0];
		transposePatterns.value[lastPatternHex.value][toHex(+row)] = `00`;
	}
}
