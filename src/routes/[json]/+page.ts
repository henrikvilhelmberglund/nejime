export let ssr = false;
export let prerender = false;
import LZString from "lz-string";
import { createContextState, loadSong } from "../../components/globalState.svelte.js";

export function load({ params }) {
	const json = LZString.decompressFromEncodedURIComponent(params.json);
	const finalObject = JSON.parse(json);
  loadSong(finalObject);

	return {
		// title: 'Hello world!',
		// content: 'Welcome to our blog. Lorem ipsum dolor sit amet...'
	};
}
