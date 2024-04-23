import { SplendidGrandPiano, Soundfont } from "smplr";
import { type Pattern, type Patterns, type Phrase } from "../types/types";

export const context = $state(new AudioContext());
export const marimba = new Soundfont(context, { instrument: "marimba" });

let activeScreenState = $state("song");
let lastPhraseHex = $state("");
let lastPatternHex = $state("");
let lastTouchedNote = $state("");

let lastRowNote = $state(0);
let lastChannelNote = $state(0);
let lastRowPhrase = $state(0);
let lastRowPattern = $state(0);
let lastChannelPattern = $state(0);

let sPressed = $state(false);
let dPressed = $state(false);
let fPressed = $state(false);
let isPlayingBack = $state(false);
let shouldPreview = $state(false);

let bpm = $state(120);
let playPosition = $state(0);
let intervalId = $state<Timer>();
let phraseLoopIntervalId = $state<Timer>();

let song = $state<Patterns>({
	"00": {
		channel0: "00",
		channel1: "01",
		channel2: "02",
		channel3: "03",
		channel4: "04"
	},
	"01": {
		channel0: "20",
		channel1: "21",
		channel2: "22",
		channel3: "23",
		channel4: "24"
	}
});
let patterns = $state<Record<string, Pattern>>({
	"00": {
		"00": "10",
		"01": "11",
		"02": "12"
	},
	"01": {
		"00": "41",
		"01": "42",
		"02": "43"
	}
});
let transposePatterns = $state<Record<string, Pattern>>({
	"00": {
		"00": "01",
		"02": "02"
	},
	"01": {
		"00": "01",
		"01": "02",
		"02": "03"
	}
});
let phrases = $state<Record<string, Phrase>>({
	"10": {
		"00": {
			"00": "C1",
			"01": "C2",
			"02": "C3",
			"03": "C#3",
			"05": "F3"
		},
		"01": {
			"00": "G3"
		}
	},
	"11": {
		"00": { "00": "E3" },
		"01": { "00": "F3" },
		"02": { "00": "G3" }
	},
	"12": {
		"00": { "00": "E4" },
		"01": { "00": "F4" },
		"02": { "00": "G4" }
	}
});

export function createPhraseLoopIntervalIdState() {
	return {
		get value() {
			return phraseLoopIntervalId;
		},
		set value(newState) {
			phraseLoopIntervalId = newState;
		},
		stop() {
			clearInterval(phraseLoopIntervalId);
		}
	};
}

export function createIntervalIdState() {
	return {
		get value() {
			return intervalId;
		},
		set value(newState) {
			intervalId = newState;
		},
		stop() {
			clearInterval(intervalId);
			playPosition = 0;
		}
	};
}

export function createIsPlayingBackState() {
	return {
		get value() {
			return isPlayingBack;
		},
		set value(newState) {
			isPlayingBack = newState;
		}
	};
}

export function createShouldPreviewState() {
	return {
		get value() {
			return shouldPreview;
		},
		set value(newState) {
			shouldPreview = newState;
		}
	};
}

export function createPlayPositionState() {
	return {
		get value() {
			return playPosition;
		},
		set value(newState) {
			playPosition = newState;
		}
	};
}

export function createBpmState() {
	return {
		get value() {
			return bpm;
		},
		set value(newBpm) {
			bpm = newBpm;
		}
	};
}

export function createActiveScreenState() {
	return {
		get value() {
			return activeScreenState;
		},
		set value(newState) {
			activeScreenState = newState;
		}
	};
}

export function createSPressedState() {
	return {
		get value() {
			return sPressed;
		},
		// initial() {
		// 	return { x: 512, y: 300 };
		// },
		set value(newState) {
			sPressed = newState;
		}
	};
}

export function createDPressedState() {
	return {
		get value() {
			return dPressed;
		},
		set value(newState) {
			dPressed = newState;
		}
	};
}

export function createFPressedState() {
	return {
		get value() {
			return fPressed;
		},
		set value(newState) {
			fPressed = newState;
		}
	};
}

export function createLastRowNoteState() {
	return {
		get value() {
			return lastRowNote;
		},
		set value(number) {
			lastRowNote = number;
		}
	};
}

export function createLastRowPhraseState() {
	return {
		get value() {
			return lastRowPhrase;
		},
		set value(number) {
			lastRowPhrase = number;
		}
	};
}

export function createLastRowPatternState() {
	return {
		get value() {
			return lastRowPattern;
		},
		set value(number) {
			lastRowPattern = number;
		}
	};
}

export function createLastChannelPatternState() {
	return {
		get value() {
			return lastChannelPattern;
		},
		set value(number) {
			lastChannelPattern = number;
		}
	};
}

export function createLastChannelNoteState() {
	return {
		get value() {
			return lastChannelNote;
		},
		set value(number) {
			lastChannelNote = number;
		}
	};
}

export function createLastPhraseHexState() {
	return {
		get value() {
			return lastPhraseHex;
		},
		set value(string: string) {
			lastPhraseHex = string;
		}
	};
}

export function createLastPatternHexState() {
	return {
		get value() {
			return lastPatternHex;
		},
		set value(string: string) {
			lastPatternHex = string;
		}
	};
}

export function createLastTouchedNoteState() {
	return {
		get value() {
			return lastTouchedNote;
		},
		set value(string: string) {
			lastTouchedNote = string;
		}
	};
}

export function createSongState() {
	return {
		get value() {
			return song;
		},
		set value(newState) {
			song = newState;
		}
		// add(patternToAdd) {
		// 	patterns.push(patternToAdd);
		// }
	};
}

export function createPatternsState() {
	return {
		get value() {
			return patterns;
		},
		set value(newState) {
			patterns = newState;
		}
		// add(patternToAdd) {
		// 	patterns.push(patternToAdd);
		// }
	};
}

export function createTransposePatternsState() {
	return {
		get value() {
			return transposePatterns;
		},
		set value(newState) {
			transposePatterns = newState;
		}
	};
}

export function createPhrasesState() {
	return {
		get value() {
			return phrases;
		},
		set value(newState) {
			phrases = newState;
		}
		// add(patternToAdd) {
		// 	patterns.push(patternToAdd);
		// }
	};
}
