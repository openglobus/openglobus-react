//vite.config.js
import { resolve } from "path";
import { defineConfig } from "vite";
import dts from "vite-plugin-dts";
import { fileURLToPath, URL } from "url";

export default defineConfig ({
    plugins: [dts()],
    resolve: {
        alias: {
            "@": fileURLToPath(new URL("./src", import.meta.url)),
        },
    },
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