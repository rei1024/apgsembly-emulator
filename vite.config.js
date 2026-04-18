import { resolve } from "node:path";

process.env.VITE_DATE = new Date().toISOString();

/** @type {import('vite').UserConfig} */
export default {
    base: "/apgsembly-emulator",
    server: {
        port: 5174,
    },
    test: {
        exclude: ["e2e/*", "tools/fast-emulator/*"],
        include: ["**/*_test.(j|t)s"],
    },
    build: {
        rolldownOptions: {
            input: {
                main: resolve(__dirname, "index.html"),
                ["eca-generator"]: resolve(
                    __dirname,
                    "tools/eca-generator/index.html",
                ),
                ["diagram"]: resolve(
                    __dirname,
                    "tools/diagram/index.html",
                ),
                ["fast-emulator"]: resolve(
                    __dirname,
                    "tools/fast-emulator/index.html",
                ),
                ["tm-to-apg"]: resolve(
                    __dirname,
                    "tools/tm-to-apg/index.html",
                ),
                ["transpiler"]: resolve(
                    __dirname,
                    "tools/transpiler/index.html",
                ),
                ["turmites"]: resolve(
                    __dirname,
                    "tools/turmites/index.html",
                ),
            },
        },
    },
};
