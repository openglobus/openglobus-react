import type {StorybookConfig} from "@storybook/react-vite";
import * as path from "node:path";

const config: StorybookConfig = {
    stories: ["../src/**/*.mdx","../src/**/*.stories.@(js|jsx|mjs|ts|tsx)"],
    addons: [
        "@storybook/addon-links",
        "@chromatic-com/storybook",
        "@storybook/addon-docs"
    ],
    core: {
        disableTelemetry: true
    },
    docs: {defaultName: 'Documentation'},
    framework: {
        name: "@storybook/react-vite",
        options: {},
    },
    staticDirs: [path.resolve(__dirname, "../public")],
};
export default config;
