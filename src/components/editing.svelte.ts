import { Soundfont } from "smplr";
import {
	activeScreenState,
	instrumentNames,
	lastPatternHex,
	lastPhraseHex,
	lastTouchedInstrument,
	lastTouchedNote,
	lastTouchedPattern,
	lastTouchedPhrase,
	song,
	instruments,
	type InstrumentType,
	phraseInstruments,
	patterns,
	transposePatterns,
	phrases,
	context
} from "./globalState.svelte";
import { toHex, toInt } from "./utils";

const notes = ["C", "C#", "D", "D#", "E", "F", "F#", "G", "G#", "A", "A#", "B"];

type addProps = {
	element: HTMLButtonElement;
};

export function add({ element }: addProps) {
	if (activeScreenState.value === "song") {
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

	if (activeScreenState.value === "pattern") {
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

	if (activeScreenState.value === "phrase") {
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

			if (!phraseInstruments.value) {
				phraseInstruments.value = {};
			}
			if (!phraseInstruments.value[lastPhraseHex.value]) {
				phraseInstruments.value[lastPhraseHex.value] = {};
			}

			phraseInstruments.value[lastPhraseHex.value][toHex(+row)] = lastTouchedInstrument.value;

			// if (!soundfonts.value[lastTouchedInstrument.value]) {
			// 	soundfonts.value[lastTouchedInstrument.value] = new Soundfont(context, {
			// 		instrument: instrumentNames["00"]
			// 	});
			// }

			phrases.value[lastPhraseHex.value][toHex(+channel)][toHex(+row)] = lastTouchedNote.value;
		} else {
		}
	}
}

type previewProps = {
	element: HTMLButtonElement;
	instrument: InstrumentType;
};

export function preview({ element, instrument }: previewProps) {
	const row = element.id.split("note")[1].split("-channel")[0];
	const channel = element.id.split("note")[1].split("-channel")[1];

	let selectedNote = phrases.value[lastPhraseHex.value]?.[toHex(+channel)]?.[toHex(+row)];
	if (selectedNote === undefined) return;
	// marimba.start({ note: selectedNote });

	if (instrument.sound) {
		instrument.sound.stop();
		instrument.sound.start({ note: selectedNote });
	}
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
	if (instrument.sound) {
		instrument.sound.stop();
	}
}

export function edit({ direction, element }: editProps) {
	if (activeScreenState.value === "song") {
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
			if (toInt(selectedPattern) > 239) {
				song.value[toHex(+row)][channel] = `${toHex(toInt(selectedPattern) - 256 + 16)}`;
			} else {
				song.value[toHex(+row)][channel] = `${toHex(toInt(selectedPattern) + 16)}`;
			}
		} else if (direction === "down") {
			if (toInt(selectedPattern) < 16) {
				song.value[toHex(+row)][channel] = `${toHex(toInt(selectedPattern) + 256 - 16)}`;
			} else {
				song.value[toHex(+row)][channel] = `${toHex(toInt(selectedPattern) - 16)}`;
			}
		}
		// ensure we get the updated value
		setTimeout(() => {
			lastTouchedPattern.value = song.value[toHex(+row)][channel];
		}, 0);
	}

	if (activeScreenState.value === "pattern") {
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
			if (toInt(selectedPhrase) > 239) {
				patterns.value[lastPatternHex.value][toHex(+row)] =
					`${toHex(toInt(selectedPhrase) - 256 + 16)}`;
			} else {
				patterns.value[lastPatternHex.value][toHex(+row)] = `${toHex(toInt(selectedPhrase) + 16)}`;
			}
		} else if (direction === "down") {
			if (toInt(selectedPhrase) < 16) {
				patterns.value[lastPatternHex.value][toHex(+row)] =
					`${toHex(toInt(selectedPhrase) + 256 - 16)}`;
			} else {
				patterns.value[lastPatternHex.value][toHex(+row)] = `${toHex(toInt(selectedPhrase) - 16)}`;
			}
		}
		// ensure we get the updated value
		setTimeout(() => {
			lastTouchedPhrase.value = patterns.value[lastPatternHex.value][toHex(+row)];
		}, 0);
	}

	if (activeScreenState.value === "phrase") {
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
		if (newNoteTone && newNoteOctave) {
			lastTouchedNote.value = newNoteTone + newNoteOctave;
		}
	}
}

export function editInstrument({ direction, element }: editProps) {
	// const instruments = createInstrumentsState();
	// const context = createContextState();

	if (activeScreenState.value === "phrase") {
		const row = element.id.split("instrument-selector")[1];
		// if instrument value doesn't exist yet, create it
		if (!phraseInstruments.value[lastPhraseHex.value]) {
			phraseInstruments.value[lastPhraseHex.value] = {};
		}
		if (!phraseInstruments.value[lastPhraseHex.value][toHex(+row)]) {
			phraseInstruments.value[lastPhraseHex.value][toHex(+row)] = "00";
		}
		if (phraseInstruments.value[lastPhraseHex.value][toHex(+row)] === "--") {
			phraseInstruments.value[lastPhraseHex.value][toHex(+row)] = "00";
		}

		let selectedInstrument = phraseInstruments.value[lastPhraseHex.value]?.[toHex(+row)];
		console.log("selected instrument", selectedInstrument);
		if (selectedInstrument === undefined) return;
		let newInstrument;

		if (direction === "right") {
			if (selectedInstrument === "FF") {
				selectedInstrument = "00";
				phraseInstruments.value[lastPhraseHex.value][toHex(+row)] =
					`${toHex(toInt(selectedInstrument))}`;
			} else {
				phraseInstruments.value[lastPhraseHex.value][toHex(+row)] =
					`${toHex(toInt(selectedInstrument) + 1)}`;
			}
		} else if (direction === "left") {
			if (selectedInstrument === "00") {
				selectedInstrument = "FF";
				phraseInstruments.value[lastPhraseHex.value][toHex(+row)] =
					`${toHex(toInt(selectedInstrument))}`;
			} else {
				phraseInstruments.value[lastPhraseHex.value][toHex(+row)] =
					`${toHex(toInt(selectedInstrument) - 1)}`;
			}
		} else if (direction === "up") {
			if (toInt(selectedInstrument) > 243) {
				phraseInstruments.value[lastPhraseHex.value][toHex(+row)] =
					`${toHex(toInt(selectedInstrument) - 256 + 12)}`;
			} else {
				phraseInstruments.value[lastPhraseHex.value][toHex(+row)] =
					`${toHex(toInt(selectedInstrument) + 12)}`;
			}
		} else if (direction === "down") {
			if (toInt(selectedInstrument) < 12) {
				phraseInstruments.value[lastPhraseHex.value][toHex(+row)] =
					`${toHex(toInt(selectedInstrument) + 256 - 12)}`;
			} else {
				phraseInstruments.value[lastPhraseHex.value][toHex(+row)] =
					`${toHex(toInt(selectedInstrument) - 12)}`;
			}
		}

		// ensure we get the updated value
		setTimeout(() => {
			if (
				instruments.value &&
				context.value &&
				!instruments.value[phraseInstruments.value[lastPhraseHex.value][toHex(+row)]]?.sound
			) {
				instruments.value[phraseInstruments.value[lastPhraseHex.value][toHex(+row)]] = {
					type: "soundfont",
					sound: new Soundfont(context.value, {
						instrument: instrumentNames["00"]
					}),
					hex: "00"
				};
			}
			lastTouchedInstrument.value = phraseInstruments.value[lastPhraseHex.value][toHex(+row)];
		}, 0);
	}
}

export function editTranspose({ direction, element }: editProps) {
	if (activeScreenState.value === "pattern") {
		const row = element.id.split("row")[1].split("-transpose")[0];
		const pattern = lastPatternHex.value;
		// const transposePatterns
		let selectedPhrase = element.innerText;
		console.table({ row, pattern, selectedPhrase });
		if (selectedPhrase === undefined) return;
		// const selectedPhraseTone = selectedPhrase.split(selectedPhrase[selectedPhrase.length - 1])[0];
		let newPhrase;
		// init object if not available yet
		if (!transposePatterns.value[lastPatternHex.value]) {
			transposePatterns.value[lastPatternHex.value] = {};
		}

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
	}
}

type deleteProps = {
	element: HTMLButtonElement;
};

export function remove({ element }: deleteProps) {
	if (activeScreenState.value === "song") {
		const row = element.id.split("row")[1].split("-channel")[0];
		const channel = element.id.split("-")[1];
		delete song.value[toHex(+row)][channel];
	}

	if (activeScreenState.value === "pattern") {
		const row = element.id.split("row")[1].split("-pattern")[0];
		const pattern = element.id.split("row")[1].split("-pattern")[1];
		delete patterns.value[lastPatternHex.value][toHex(+row)];
	}

	if (activeScreenState.value === "phrase") {
		const row = element.id.split("note")[1].split("-channel")[0];
		const channel = element.id.split("note")[1].split("-channel")[1];
		delete phrases.value[lastPhraseHex.value][toHex(+channel)][toHex(+row)];
		console.log(phrases.value[lastPhraseHex.value][toHex(+channel)][toHex(+row)]);
		if (
			Object.values(phrases.value[lastPhraseHex.value]).every(
				(a) => a[toHex(+row)] === "---" || a[toHex(+row)] === undefined
			)
		) {
			phraseInstruments.value[lastPhraseHex.value][toHex(+row)] = `--`;
		}
	}
}

export function removeTranspose({ element }: deleteProps) {
	if (activeScreenState.value === "pattern") {
		const row = element.id.split("row")[1].split("-transpose")[0];
		transposePatterns.value[lastPatternHex.value][toHex(+row)] = `00`;
	}
}
