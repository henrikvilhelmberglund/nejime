let activeScreenState = $state("song");
let activePhraseElementId = $state();
let activePhrase = $state();
let activePatternElementId = $state();
let activePattern = $state();
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
		"00": "C1",
		"01": "C2",
		"02": "C3"
  },
  "01": {
		"00": "E3",
		"01": "F3",
		"02": "G3"
	},
});
let phrases = $state({});

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
