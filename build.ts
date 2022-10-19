import * as esbuild from "https://deno.land/x/esbuild@v0.15.10/mod.js";
import { denoPlugin } from "https://deno.land/x/esbuild_deno_loader@0.6.0/mod.ts";

// deno run --allow-net=deno.land,registry.npmjs.org --allow-env --allow-read --allow-write=. --allow-run build.ts

const outputPath =  "./frontend/index.dist.js";

await esbuild.build({
    plugins: [denoPlugin()],
    entryPoints: ["./frontend/index.js"],
    outfile: outputPath,
    bundle: true,
    format: "esm",
    minify: true,
    target: ["chrome99", "firefox99", "safari15"],
    treeShaking: true,
});

esbuild.stop();

const stat = await Deno.stat(outputPath);
console.log(stat.size.toLocaleString() + " bytes");
