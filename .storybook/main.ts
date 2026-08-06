import type { StorybookConfig } from "@storybook/react-vite";
import { fileURLToPath } from "node:url";

const config: StorybookConfig = {
    stories: [
        "../src/**/*.mdx",
        "../src/**/*.stories.@(js|jsx|mjs|ts|tsx)",
    ],
    addons: [
        "@storybook/addon-links",
        "@chromatic-com/storybook",
        "@storybook/addon-docs",
    ],
    core: {
        disableTelemetry: true,
    },
    docs: {
        defaultName: "Documentation",
    },
    framework: {
        name: "@storybook/react-vite",
        options: {},
    },
    staticDirs: [
        fileURLToPath(new URL("../public", import.meta.url)),
    ],
};

export default config;