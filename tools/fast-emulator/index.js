// @ts-check

// @ts-ignore
import * as Comlink from "https://cdn.jsdelivr.net/npm/comlink@4.4.2/dist/esm/comlink.mjs";

const worker = new Worker("./worker.js", { type: "module" });

const app = Comlink.wrap(worker);

const output = document.querySelector("#output");

async function init() {
    if (output == null) {
        throw Error("error");
    }

    output.textContent = "Initializing...";

    // console.log('a');
    const response = await fetch("../../frontend/data/pi_calc.apg");
    if (!response.ok) {
        output.textContent = "Error loading pi_calc.apg";
        throw new Error("Network response was not ok");
    }
    const text = await response.text();
    // console.log(text.slice(0, 20));
    await app.initialize(text);
    // console.log(JSON.stringify(await app.getOutput()));
    await render();
    async function render() {
        if (output == null) {
            throw Error("error");
        }
        output.textContent = `[${(await app.getSteps()).toLocaleString()}]` +
            (await app.getOutput());
    }

    const update = async () => {
        // console.log(time);
        await app.run(2000000);
        await render();
        requestAnimationFrame(update);
    };
    requestAnimationFrame(update);
}

init();
