import * as esbuild from "esbuild";
import { denoPlugins } from "jsr:@luca/esbuild-deno-loader@0.11.1";
import { serveDir } from "jsr:@std/http@^1/file-server";

// deno run --allow-env --allow-read --allow-write=. --allow-run build.ts

const entryPoint = "./frontend/index.js";
const outputPath = "./dist/index.dist.js";

const target = ["chrome100", "firefox100", "safari16"];

const isDev = Deno.args.includes("dev");

await esbuild.build({
    plugins: [...denoPlugins()],
    entryPoints: [entryPoint],
    outfile: outputPath,
    bundle: true,
    format: "esm",
    minify: true,
    target: target,
    treeShaking: true,
    sourcemap: isDev ? "linked" : false,
});

await esbuild.build({
    entryPoints: ["./frontend/style.css"],
    outfile: "./dist/style.min.css",
    minify: true,
    target: target,
});

esbuild.stop();

const fileInfo = await Deno.stat(outputPath);
const file = await Deno.open(outputPath);
const compressed = await new Response(
    file.readable.pipeThrough(new CompressionStream("gzip")),
).arrayBuffer();

console.log(`${entryPoint} -> ${outputPath}`);
console.log(
    fileInfo.size.toLocaleString() + " bytes" +
        `\n${compressed.byteLength.toLocaleString()} bytes (gzip)`,
);

if (isDev) {
    Deno.serve({ port: 1123 }, (req) => serveDir(req, { fsRoot: "./" }));
}
