export function toHex(input: number) {
	return input.toString(16).toUpperCase().padStart(2, "0");
}

export function toHexSingle(input: number) {
	return input.toString(16).toUpperCase().padStart(1, "0");
}

export function addSpace(input: string) {
	if (input.length === 2) {
		let newInput = `${input[0]}&nbsp;&nbsp;${input[1]}`;
		input = newInput;
	}
	return input;
}
