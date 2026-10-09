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
                main: resolve(import.meta.dirname, "index.html"),
                ["eca-generator"]: resolve(
                    import.meta.dirname,
                    "tools/eca-generator/index.html",
                ),
                ["diagram"]: resolve(
                    import.meta.dirname,
                    "tools/diagram/index.html",
                ),
                ["fast-emulator"]: resolve(
                    import.meta.dirname,
                    "tools/fast-emulator/index.html",
                ),
                ["tm-to-apg"]: resolve(
                    import.meta.dirname,
                    "tools/tm-to-apg/index.html",
                ),
                ["transpiler"]: resolve(
                    import.meta.dirname,
                    "tools/transpiler/index.html",
                ),
                ["turmites"]: resolve(
                    import.meta.dirname,
                    "tools/turmites/index.html",
                ),
            },
        },
    },
};
