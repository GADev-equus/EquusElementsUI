/** @type { import('@storybook/react-vite').StorybookConfig } */
const config = {
	stories: ["../src/**/*.stories.@(js|jsx|mjs|ts|tsx)"],
	framework: "@storybook/react-vite",
	core: {
		disableTelemetry: true,
		disableWhatsNewNotifications: true,
	},
};
export default config;
