import transformerVariantGroup from "@unocss/transformer-variant-group";
import { defineConfig, presetIcons, presetUno, presetWebFonts } from "unocss";
import { presetForms } from "@julr/unocss-preset-forms";
import { presetHeroPatterns } from "@julr/unocss-preset-heropatterns";
import { createSafeList } from "./src/lib/theme/safelist";
import { themes } from "./src/lib/theme/theme";
import presetTheme from "unocss-preset-theme";

export default defineConfig({
	rules: [],
	shortcuts: [],
	safelist: [
		// ...Array.from({ length: 26 }, (_, i) => String.fromCharCode("a".charCodeAt(0) + i)).map(
		// 	(char) => `font-${char}`
		// ),
		...createSafeList()
		// `font-thin font-extralight font-light font-normal font-medium font-semibold font-bold font-extrabold font-black
		//     btn-primary btn-secondary`,
	],
	theme: {
		animation: {
			keyframes: {
				"custom-fade": "{0%{opacity:0}25%{opacity:100}85%{opacity:100}100%{opacity:0}}"
			}
		}
	},
	presets: [
		presetUno({ dark: "class" }),
		presetForms(),
		// fix types later
		// @ts-ignore
		presetTheme({
			theme: themes
		}),
		// @ts-ignore
		presetHeroPatterns(),
		presetWebFonts({
			provider: "google", // default provider
			fonts: {
				// these will extend the default theme
				sans: "Roboto",
				mono: ["Fira Code", "Fira Mono:400,700"],
				// custom ones
				lobster: "Lobster",
				lato: [
					{
						name: "Lato",
						weights: ["400", "700"],
						italic: true
					},
					{
						name: "sans-serif",
						provider: "none"
					}
				],
				a: "Playfair Display",
				b: "Lora"
			}
		}),
		presetIcons({
			extraProperties: {
				display: "inline-block"
				// ...
			}
		})
	],
	transformers: [transformerVariantGroup()]
});
