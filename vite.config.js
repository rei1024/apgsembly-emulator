import { resolve } from "node:path";

process.env.VITE_DATE = new Date().toISOString();

/** @type {import('vitest').UserConfig} */
export default {
    base: "/apgsembly-emulator",
    server: {
        port: 5174,
    },
    test: {
        exclude: ["e2e/*", "tools/fast-emulator/*"],
        include: ["**/*_test.(j|t)s"],
    },
    build: {},
};
