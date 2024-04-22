export type Note = Record<string, string>;
export type Phrase = Record<string, Note>;
export type Pattern = Record<string, string>;
export type Patterns = Record<string, Pattern>;
export type Song = Record<string, Pattern>;
export type TransposePattern = Record<string, Record<string, string>>;

