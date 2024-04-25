import {
	createActiveScreenState,
	createLastPatternHexState,
	createLastPhraseHexState,
	createLastTouchedNoteState,
	createLastTouchedPhraseState,
	createPatternsState,
	createPhrasesState,
	marimba
} from "./globalState.svelte";
import { toHex, toInt } from "./utils";

let activeScreen = createActiveScreenState();
let lastPatternHex = createLastPatternHexState();
let lastPhraseHex = createLastPhraseHexState();
let lastTouchedPhrase = createLastTouchedPhraseState();
let lastTouchedNote = createLastTouchedNoteState();
let patterns = createPatternsState();
let phrases = createPhrasesState();
const notes = ["C", "C#", "D", "D#", "E", "F", "F#", "G", "G#", "A", "A#", "B"];

type addProps = {
	element: HTMLButtonElement;
};

export function add({ element }: addProps) {
	if (activeScreen.value === "pattern") {
		const row = element.id.split("row")[1].split("-pattern")[0];
		const pattern = element.id.split("row")[1].split("-pattern")[1];

		if (element.innerText === "--") {
			console.log("new pattern here");

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
	instrument: number;
};

export function preview({ element, instrument }: previewProps) {
	const row = element.id.split("note")[1].split("-channel")[0];
	const channel = element.id.split("note")[1].split("-channel")[1];
	let selectedNote = phrases.value[lastPhraseHex.value]?.[toHex(+channel)]?.[toHex(+row)];
	if (selectedNote === undefined) return;
	marimba.start({ note: selectedNote });
}

type editProps = {
	direction: string;
	element: HTMLButtonElement;
};

export function edit({ direction, element }: editProps) {
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

type deleteProps = {
	element: HTMLButtonElement;
};

export function remove({ element }: deleteProps) {
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
