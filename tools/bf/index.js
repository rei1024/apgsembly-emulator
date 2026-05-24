// @ts-check
/**
 * Transpiler
 * @packageDocumentation
 */

import { $type } from "../../frontend/util/selector.js";
import { generateBFCode } from "./bf.js";

const $input = $type("#input", HTMLTextAreaElement);
const $output = $type("#output", HTMLTextAreaElement);
const $generate = $type("#generate", HTMLElement);
const $copy = $type("#copy", HTMLButtonElement);

$generate.addEventListener("click", () => {
    const result = generateBFCode({ code: $input.value, input: "" });
    $input.classList.remove("is-invalid");
    $copy.disabled = false;
    $output.value = result;
});

$copy.addEventListener("click", async () => {
    await navigator.clipboard.writeText($output.value.trim());

    $copy.textContent = "Copied";
    $copy.classList.add("btn-success");
    $copy.classList.remove("btn-primary");
    setTimeout(() => {
        $copy.textContent = "Copy";
        $copy.classList.remove("btn-success");
        $copy.classList.add("btn-primary");
    }, 1000);
});
