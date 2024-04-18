let activeScreenState = $state("song");
let activeNoteElementId = $state();
let activeNote = $state();
let activePhraseElementId = $state();
let activePhrase = $state();
let activePatternElementId = $state();
let activePattern = $state("");
let sPressed = $state(false);
let dPressed = $state(false);
let fPressed = $state(false);
let song = $state({
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
let patterns = $state({
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
let transposePatterns = $state({
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
let phrases = $state({
	"10": {
		"00": {
			"00": "C1",
			"01": "C2",
			"02": "C3",
			"03": "C#3"
		}
	},
	"11": {
		"00": "E3",
		"01": "F3",
		"02": "G3"
	},
	"12": {
		"00": "E4",
		"01": "F4",
		"02": "G4"
	}
});

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

export function createActiveNoteElementIdState() {
	return {
		get value() {
			return activeNoteElementId;
		},
		// initial() {
		// 	return { x: 512, y: 300 };
		// },
		set value(id) {
			activeNoteElementId = id;
		}
	};
}

export function createActiveNoteState() {
	return {
		get value() {
			return activeNote;
		},
		set value(hex) {
			activeNote = hex;
		}
	};
}

export function createActivePhraseElementIdState() {
	return {
		get value() {
			return activePhraseElementId;
		},
		// initial() {
		// 	return { x: 512, y: 300 };
		// },
		set value(id) {
			activePhraseElementId = id;
		}
	};
}

export function createActivePhraseState() {
	return {
		get value() {
			return activePhrase;
		},
		set value(hex) {
			activePhrase = hex;
		}
	};
}

export function createActivePatternElementIdState() {
	// function set(id: string) {
	// 	activePatternElementId = id;
	// }
	// set

	return {
		get value() {
			return activePatternElementId;
		},
		// initial() {
		// 	return { x: 512, y: 300 };
		// },
		set value(id) {
			activePatternElementId = id;
		}
	};
}

export function createActivePatternState() {
	return {
		get value() {
			return activePattern;
		},
		set value(hex) {
			activePattern = hex;
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
