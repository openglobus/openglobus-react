//vite.config.js
import { resolve } from "path";
import { defineConfig } from "vite";
import dts from "vite-plugin-dts";

export default defineConfig ({
    plugins: [dts()],

    build: {
        sourcemap: true,
        lib: {
            entry: resolve(__dirname, "src/index.tsx"),
            name: "@openglobus/openglobus-react",

            fileName: "index",
        },
        rollupOptions: {
            external: ["react"],
        },
    },
});