let activePhraseElementId = $state();
let activePatternElementId = $state();
let sPressed = $state(false);


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
