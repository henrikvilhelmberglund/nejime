import { Soundfont } from "smplr";
import { type Pattern, type Patterns, type Phrase } from "../types/types";
import { Buffer } from "buffer";
globalThis.Buffer = Buffer;
import LZString from "lz-string";
import { browser } from "$app/environment";

// const instrumentNames = getSoundfontNames();
export const instrumentNames = {
	"00": "acoustic_grand_piano",
	"01": "bright_acoustic_piano",
	"02": "electric_grand_piano",
	"03": "honkytonk_piano",
	"04": "electric_piano_1",
	"05": "electric_piano_2",
	"06": "harpsichord",
	"07": "clavinet",
	"08": "celesta",
	"09": "glockenspiel",
	"0A": "music_box",
	"0B": "vibraphone",
	"0C": "marimba",
	"0D": "xylophone",
	"0E": "tubular_bells",
	"0F": "dulcimer",
	"10": "drawbar_organ",
	"11": "percussive_organ",
	"12": "rock_organ",
	"13": "church_organ",
	"14": "reed_organ",
	"15": "accordion",
	"16": "harmonica",
	"17": "tango_accordion",
	"18": "acoustic_guitar_nylon",
	"19": "acoustic_guitar_steel",
	"1A": "electric_guitar_jazz",
	"1B": "electric_guitar_clean",
	"1C": "electric_guitar_muted",
	"1D": "overdriven_guitar",
	"1E": "distortion_guitar",
	"1F": "guitar_harmonics",
	"20": "acoustic_bass",
	"21": "electric_bass_finger",
	"22": "electric_bass_pick",
	"23": "fretless_bass",
	"24": "slap_bass_1",
	"25": "slap_bass_2",
	"26": "synth_bass_1",
	"27": "synth_bass_2",
	"28": "violin",
	"29": "viola",
	"2A": "cello",
	"2B": "contrabass",
	"2C": "tremolo_strings",
	"2D": "pizzicato_strings",
	"2E": "orchestral_harp",
	"2F": "timpani",
	"30": "string_ensemble_1",
	"31": "string_ensemble_2",
	"32": "synth_strings_1",
	"33": "synth_strings_2",
	"34": "choir_aahs",
	"35": "voice_oohs",
	"36": "synth_choir",
	"37": "orchestra_hit",
	"38": "trumpet",
	"39": "trombone",
	"3A": "tuba",
	"3B": "muted_trumpet",
	"3C": "french_horn",
	"3D": "brass_section",
	"3E": "synth_brass_1",
	"3F": "synth_brass_2",
	"40": "soprano_sax",
	"41": "alto_sax",
	"42": "tenor_sax",
	"43": "baritone_sax",
	"44": "oboe",
	"45": "english_horn",
	"46": "bassoon",
	"47": "clarinet",
	"48": "piccolo",
	"49": "flute",
	"4A": "recorder",
	"4B": "pan_flute",
	"4C": "blown_bottle",
	"4D": "shakuhachi",
	"4E": "whistle",
	"4F": "ocarina",
	"50": "lead_1_square",
	"51": "lead_2_sawtooth",
	"52": "lead_3_calliope",
	"53": "lead_4_chiff",
	"54": "lead_5_charang",
	"55": "lead_6_voice",
	"56": "lead_7_fifths",
	"57": "lead_8_bass__lead",
	"58": "pad_1_new_age",
	"59": "pad_2_warm",
	"5A": "pad_3_polysynth",
	"5B": "pad_4_choir",
	"5C": "pad_5_bowed",
	"5D": "pad_6_metallic",
	"5E": "pad_7_halo",
	"5F": "pad_8_sweep",
	"60": "fx_1_rain",
	"61": "fx_2_soundtrack",
	"62": "fx_3_crystal",
	"63": "fx_4_atmosphere",
	"64": "fx_5_brightness",
	"65": "fx_6_goblins",
	"66": "fx_7_echoes",
	"67": "fx_8_scifi",
	"68": "sitar",
	"69": "banjo",
	"6A": "shamisen",
	"6B": "koto",
	"6C": "kalimba",
	"6D": "bagpipe",
	"6E": "fiddle",
	"6F": "shanai",
	"70": "tinkle_bell",
	"71": "agogo",
	"72": "steel_drums",
	"73": "woodblock",
	"74": "taiko_drum",
	"75": "melodic_tom",
	"76": "synth_drum",
	"77": "reverse_cymbal",
	"78": "guitar_fret_noise",
	"79": "breath_noise",
	"7A": "seashore",
	"7B": "bird_tweet",
	"7C": "telephone_ring",
	"7D": "helicopter",
	"7E": "applause",
	"7F": "gunshot"
};

let context = $state(browser ? new AudioContext() : undefined);

export function createContextState() {
	return {
		get value() {
			return context;
		},
		set value(newState) {
			context = newState;
		}
	};
}

let activeScreenState = $state("song");
let lastPhraseHex = $state("");
let lastPatternHex = $state("");
let lastTouchedPattern = $state("00");
let lastTouchedPhrase = $state("00");
let lastTouchedNote = $state("C4");
let lastTouchedInstrument = $state("00");

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
let playPositionPhrase = $state(0);
let playPositionPattern = $state(0);
let playPositionSong = $state(0);
let intervalId = $state<Timer>();
let phraseLoopIntervalId = $state<Timer>();

// for song playback
let playPositionsPhrases = $state<Record<number, number>>({
	0: 0,
	1: 0,
	2: 0,
	3: 0,
	4: 0
});

export function createPlayPositionsPhrasesState() {
	return {
		get value() {
			return playPositionsPhrases;
		},
		set value(newState) {
			playPositionsPhrases = newState;
		},
		reset() {
			playPositionsPhrases = { 0: 0, 1: 0, 2: 0, 3: 0, 4: 0 };
		}
	};
}

let playPositionsPatterns = $state<Record<number, number>>({ 0: 0, 1: 0, 2: 0, 3: 0, 4: 0 });

export function createPlayPositionsPatternsState() {
	return {
		get value() {
			return playPositionsPatterns;
		},
		set value(newState) {
			playPositionsPatterns = newState;
		},
		reset() {
			playPositionsPatterns = { 0: 0, 1: 0, 2: 0, 3: 0, 4: 0 };
		}
	};
}

let playPositionsSong = $state<Record<number, number>>({ 0: 0, 1: 0, 2: 0, 3: 0, 4: 0 });

export function createPlayPositionsSongState() {
	return {
		get value() {
			return playPositionsSong;
		},
		set value(newState) {
			playPositionsSong = newState;
		},
		reset() {
			playPositionsSong = { 0: 0, 1: 0, 2: 0, 3: 0, 4: 0 };
		}
	};
}

let intervalIdsSong = $state<Record<number, Timer | undefined>>({
	0: undefined,
	1: undefined,
	2: undefined,
	3: undefined,
	4: undefined
});

export function createIntervalIdsSongState() {
	return {
		get value() {
			return intervalIdsSong;
		},
		set value(newState) {
			intervalIdsSong = newState;
		},

		stopAllIntervals() {
			for (const channel in intervalIdsSong) {
				clearInterval(intervalIdsSong[channel]);
				playPositionsSong[channel] = 0;
				playPositionsPatterns[channel] = 0;
				playPositionsPhrases[channel] = 0;
			}
		}
	};
}

export function saveSong() {
	const exportBpm = $state.snapshot(bpm);
	const exportInstruments = $state.snapshot(instruments);
	const exportInstrumentDurations = $state.snapshot(instrumentDurations);
	const exportSong = $state.snapshot(song);
	const exportPatterns = $state.snapshot(patterns);
	const exportTransposePatterns = $state.snapshot(transposePatterns);
	const exportPhrases = $state.snapshot(phrases);
	const exportPhraseInstruments = $state.snapshot(phraseInstruments);

	const allData = {
		bpm: exportBpm,
		// instruments: exportInstruments,
		instrumentDurations: exportInstrumentDurations,
		song: exportSong,
		patterns: exportPatterns,
		transposePatterns: exportTransposePatterns,
		phrases: exportPhrases,
		phraseInstruments: exportPhraseInstruments
	};

	console.log(allData);

	let objJsonStr = JSON.stringify(allData);
	// console.log(objJsonStr);
	// let objJsonB64 = Buffer.from(objJsonStr).toString("base64");
	let objJsonB64 = LZString.compressToEncodedURIComponent(objJsonStr);

	return objJsonB64;
}

type songProps = {
	bpm: number;
	instrumentDurations: Record<string, number>;
	song: Patterns;
	patterns: Patterns;
	transposePatterns: Patterns;
	phrases: Record<string, Phrase>;
	phraseInstruments: Record<string, Record<string, string>>;
};

export function loadSong(obj: songProps) {
	bpm = obj.bpm;
	instrumentDurations = obj.instrumentDurations;
	song = obj.song;
	patterns = obj.patterns;
	transposePatterns = obj.transposePatterns;
	phrases = obj.phrases;
	phraseInstruments = obj.phraseInstruments;
}

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

export type instrumentType = {
	type: string;
	sound: Soundfont;
};

let instruments = $state<Record<string, instrumentType> | undefined>(
	browser && context ?
		{
			"00": {
				type: "soundfont",
				sound: new Soundfont(context, { instrument: instrumentNames["3C"] })
			},
			"01": {
				type: "soundfont",
				sound: new Soundfont(context, { instrument: instrumentNames["08"] })
			},
			FF: {
				type: "soundfontdrums",
				sound: new Soundfont(context, {
					instrumentUrl:
						"https://henrikvilhelmberglund.com/midi-js-compat-soundfonts/GM-soundfonts/FluidR3_GM/drumkits/Standard-mp3.js",
					volume: 80
				})
			}
		}
	:	undefined
);

let instrumentDurations = $state<Record<string, number>>({
	"00": 0.3,
	"01": 0.1
});

let phraseInstruments = $state<Record<string, Record<string, string>>>({
	"10": {
		"00": "00",
		"01": "00",
		"02": "01",
		"03": "01",
		"05": "01"
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
		// not used
		stop() {
			clearInterval(intervalId);
			playPositionPhrase = 0;
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

export function createPlayPositionPhraseState() {
	return {
		get value() {
			return playPositionPhrase;
		},
		set value(newState) {
			playPositionPhrase = newState;
		}
	};
}
export function createPlayPositionPatternState() {
	return {
		get value() {
			return playPositionPattern;
		},
		set value(newState) {
			playPositionPattern = newState;
		}
	};
}
export function createPlayPositionSongState() {
	return {
		get value() {
			return playPositionSong;
		},
		set value(newState) {
			playPositionSong = newState;
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

export function createLastTouchedPatternState() {
	return {
		get value() {
			return lastTouchedPattern;
		},
		set value(string: string) {
			lastTouchedPattern = string;
		}
	};
}

export function createLastTouchedPhraseState() {
	return {
		get value() {
			return lastTouchedPhrase;
		},
		set value(string: string) {
			lastTouchedPhrase = string;
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

export function createLastTouchedInstrumentState() {
	return {
		get value() {
			return lastTouchedInstrument;
		},
		set value(string: string) {
			lastTouchedInstrument = string;
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
	};
}

export function createInstrumentsState() {
	return {
		get value() {
			return instruments;
		},
		set value(newState) {
			instruments = newState;
		}
	};
}

export function createInstrumentDurationsState() {
	return {
		get value() {
			return instrumentDurations;
		},
		set value(newState) {
			instrumentDurations = newState;
		}
	};
}

export function createPhraseInstrumentsState() {
	return {
		get value() {
			return phraseInstruments;
		},
		set value(newState) {
			phraseInstruments = newState;
		}
	};
}
