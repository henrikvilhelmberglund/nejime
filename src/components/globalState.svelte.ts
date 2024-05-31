import { Soundfont } from "smplr";
import { type Pattern, type Patterns, type Phrase } from "../types/types";
import { Buffer } from "buffer";
globalThis.Buffer = Buffer;
import LZString from "lz-string";
import { browser } from "$app/environment";

export function ref<Type>(initial: Type) {
	let value = $state(initial);
	return {
		get value() {
			return value;
		},
		set value(v) {
			value = v;
		}
	};
}

// const instrumentNames = getSoundfontNames();
export const instrumentNames = <Record<string, string>>{
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

export let context = ref(browser ? new AudioContext() : undefined);

// export function createContextState() {
// 	return {
// 		get value() {
// 			return context;
// 		},
// 		set value(newState) {
// 			context = newState;
// 		}
// 	};
// }

export const activeScreenState = ref("song");
export const lastPhraseHex = ref("");
export const lastPatternHex = ref("");
export const lastTouchedPattern = ref("00");
export const lastTouchedPhrase = ref("00");
export const lastTouchedNote = ref("C4");
export const lastTouchedInstrument = ref("00");
export const openedInstrument = ref("");

export const lastRowNote = ref(0);
export const lastChannelNote = ref(0);
export const lastRowPhrase = ref(0);
export const lastRowPattern = ref(0);
export const lastChannelPattern = ref(0);

export const sPressed = ref(false);
export const dPressed = ref(false);
export const fPressed = ref(false);
export const isPlayingBack = ref(false);
export const shouldPreview = ref(false);

export const bpm = ref(120);

export let song = ref<Patterns>({});

export let patterns = ref<Record<string, Pattern>>({});

export let transposePatterns = ref<Record<string, Pattern>>({});

export let phrases = ref<Record<string, Phrase>>({});

export type InstrumentType = {
	type: string;
	sound?: Soundfont;
	hex: string;
};

export let instruments = ref<Record<string, InstrumentType> | undefined>(
	browser && context.value ?
		{
			"00": {
				type: "soundfont",
				sound: new Soundfont(context.value, {
					instrument: instrumentNames["00"]
				}),
				hex: "00"
			},
			FF: {
				type: "soundfontdrums",
				sound: new Soundfont(context.value, {
					instrumentUrl:
						"https://henrikvilhelmberglund.com/midi-js-compat-soundfonts/GM-soundfonts/FluidR3_GM/drumkits/Standard-mp3.js",
					volume: 80
				}),
				hex: "FF"
			}
		}
	:	undefined
);

export let instrumentDurations = ref<Record<string, number>>({});

export let phraseInstruments = ref<Record<string, Record<string, string>>>({});

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
	const exportBpm = $state.snapshot(bpm.value);
	const exportInstruments = $state.snapshot(instruments.value);
	if (exportInstruments) {
		// remove soundfonts from saved data
		Object.values(exportInstruments).forEach((inner) => {
			if (inner.hasOwnProperty("sound")) {
				delete inner.sound;
			}
		});
	}
	const exportInstrumentDurations = $state.snapshot(instrumentDurations.value);
	const exportSong = $state.snapshot(song.value);
	const exportPatterns = $state.snapshot(patterns.value);
	const exportTransposePatterns = $state.snapshot(transposePatterns.value);
	const exportPhrases = $state.snapshot(phrases.value);
	const exportPhraseInstruments = $state.snapshot(phraseInstruments.value);

	const allData = {
		bpm: exportBpm,
		instruments: exportInstruments,
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
	instruments: Record<string, InstrumentType>;
	song: Patterns;
	patterns: Patterns;
	transposePatterns: Patterns;
	phrases: Record<string, Phrase>;
	phraseInstruments: Record<string, Record<string, string>>;
};

export function loadSong(obj: songProps) {
	bpm.value = obj.bpm;
	console.log(obj);
	if (obj.instruments) {
		instruments.value = obj.instruments;
		// load soundfonts for each instrument
		Object.values(instruments.value).forEach((loadedInstrument) => {
			if (context.value) {
				if (loadedInstrument.type === "soundfont") {
					loadedInstrument.sound = new Soundfont(context.value, {
						instrument: instrumentNames[loadedInstrument.hex]
					});
				} else if (loadedInstrument.type === "soundfontdrums") {
					loadedInstrument.sound = new Soundfont(context.value, {
						instrumentUrl:
							"https://henrikvilhelmberglund.com/midi-js-compat-soundfonts/GM-soundfonts/FluidR3_GM/drumkits/Standard-mp3.js",
						volume: 80
					});
				}
			}
		});
	}
	instrumentDurations.value = obj.instrumentDurations;
	song.value = obj.song;
	patterns.value = obj.patterns;
	transposePatterns.value = obj.transposePatterns;
	phrases.value = obj.phrases;
	phraseInstruments.value = obj.phraseInstruments;
}

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
			playPositionsPhrases[0] = 0;
			playPositionsPhrases[1] = 0;
			playPositionsPhrases[2] = 0;
			playPositionsPhrases[3] = 0;
			playPositionsPhrases[4] = 0;
		}
	};
}

export function newSong() {
	song.value = {};

	patterns.value = {};

	transposePatterns.value = {};

	phrases.value = {};

	instruments.value =
		browser && context.value ?
			{
				"00": {
					type: "soundfont",
					sound: new Soundfont(context.value, { instrument: instrumentNames["00"] }),
					hex: "00"
				},
				FF: {
					type: "soundfontdrums",
					sound: new Soundfont(context.value, {
						instrumentUrl:
							"https://henrikvilhelmberglund.com/midi-js-compat-soundfonts/GM-soundfonts/FluidR3_GM/drumkits/Standard-mp3.js",
						volume: 80
					}),
					hex: "FF"
				}
			}
		:	undefined;

	instrumentDurations.value = {
		"00": 0.3
	};

	phraseInstruments.value = {};
}
