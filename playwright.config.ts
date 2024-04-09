import type { PlaywrightTestConfig } from '@playwright/test';

const config: PlaywrightTestConfig = {
	webServer: {
		command: 'nr dev',
		port: 5173
	},
	// testDir: './e2e',
	testMatch: /(.+\.)?(e2e|spec)\.[jt]s/
};

export default config;
