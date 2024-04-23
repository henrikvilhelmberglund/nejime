import {
	createActiveScreenState,
	createLastPatternHexState,
	createLastPhraseHexState,
	createLastTouchedNoteState,
	createPhrasesState,
	marimba
} from "./globalState.svelte";
import { toHex } from "./utils";

let activeScreen = createActiveScreenState();
let lastPattern = createLastPatternHexState();
let lastPhrase = createLastPhraseHexState();
let lastTouchedNote = createLastTouchedNoteState();
let phrases = createPhrasesState();
const notes = ["C", "C#", "D", "D#", "E", "F", "F#", "G", "G#", "A", "A#", "B"];

type addProps = {
	element: HTMLButtonElement;
};

export function add({ element }: addProps) {
	if (activeScreen.value === "phrase") {
		const row = element.id.split("note")[1].split("-channel")[0];
		const channel = element.id.split("note")[1].split("-channel")[1];

		if (element.innerText === "---") {
			console.log("new note here");
			console.log(phrases.value[lastPhrase.value][toHex(+channel)]);

			// initialize empty object if they do not exist
			if (!phrases.value) {
				phrases.value = {};
			}
			if (!phrases.value[lastPhrase.value]) {
				phrases.value[lastPhrase.value] = {};
			}
			if (!phrases.value[lastPhrase.value][toHex(+channel)]) {
				phrases.value[lastPhrase.value][toHex(+channel)] = {};
			}

			phrases.value[lastPhrase.value][toHex(+channel)][toHex(+row)] = "C3";
		} else {
		}
	}
}

export function preview({ element, instrument }) {
	const row = element.id.split("note")[1].split("-channel")[0];
	const channel = element.id.split("note")[1].split("-channel")[1];
	let selectedNote = phrases.value[lastPhrase.value]?.[toHex(+channel)]?.[toHex(+row)];
	if (selectedNote === undefined) return;
	marimba.start({ note: selectedNote });
}

type editProps = {
	direction: string;
	element: HTMLButtonElement;
};

export function edit({ direction, element }: editProps) {
	const row = element.id.split("note")[1].split("-channel")[0];
	const channel = element.id.split("note")[1].split("-channel")[1];
	let selectedNote = phrases.value[lastPhrase.value]?.[toHex(+channel)]?.[toHex(+row)];
	if (selectedNote === undefined) return;
	const selectedNoteTone = selectedNote.split(selectedNote[selectedNote.length - 1])[0];
	const selectedNoteOctave = selectedNote[selectedNote.length - 1];
	let newNoteTone;
	let newNoteOctave;

	if (activeScreen.value === "phrase")
		if (direction === "right") {
			// console.log(row, channel);
			if (notes.indexOf(selectedNoteTone) === notes.length - 1) {
				if (+selectedNoteOctave > 6) return;
				newNoteTone = "C";
				newNoteOctave = +selectedNoteOctave + 1;
				phrases.value[lastPhrase.value][toHex(+channel)][toHex(+row)] =
					`${newNoteTone}${newNoteOctave}`;
			} else {
				newNoteTone = notes[notes.indexOf(selectedNoteTone) + 1];
				newNoteOctave = +selectedNoteOctave;
				phrases.value[lastPhrase.value][toHex(+channel)][toHex(+row)] =
					`${newNoteTone}${newNoteOctave}`;
			}
		} else if (direction === "left") {
			if (notes.indexOf(selectedNoteTone) === 0) {
				if (+selectedNoteOctave <= 0) return;
				newNoteTone = "B";
				newNoteOctave = +selectedNoteOctave - 1;
				phrases.value[lastPhrase.value][toHex(+channel)][toHex(+row)] =
					`${newNoteTone}${newNoteOctave}`;
			} else {
				newNoteTone = notes[notes.indexOf(selectedNoteTone) - 1];
				newNoteOctave = +selectedNoteOctave;
				phrases.value[lastPhrase.value][toHex(+channel)][toHex(+row)] =
					`${newNoteTone}${newNoteOctave}`;
			}
		} else if (direction === "up") {
			if (+selectedNoteOctave > 6) return;
			newNoteTone = selectedNoteTone;
			newNoteOctave = +selectedNoteOctave + 1;
			phrases.value[lastPhrase.value][toHex(+channel)][toHex(+row)] =
				`${newNoteTone}${newNoteOctave}`;
		} else if (direction === "down") {
			if (+selectedNoteOctave <= 0) return;
			newNoteTone = selectedNoteTone;
			newNoteOctave = +selectedNoteOctave - 1;
			phrases.value[lastPhrase.value][toHex(+channel)][toHex(+row)] =
				`${newNoteTone}${newNoteOctave}`;
		}
}
