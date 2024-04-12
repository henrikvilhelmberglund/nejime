export function toHex(input: number) {
	return input.toString(16).toUpperCase().padStart(2, "0");
}
