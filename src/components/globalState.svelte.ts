let activeScreenState = $state("song");
let activePhraseElementId = $state();
let activePatternElementId = $state();
let sPressed = $state(false);
let dPressed = $state(false);
let fPressed = $state(false);

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

export function createActivePhraseElementId() {
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

export function createActivePatternElementId() {
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
