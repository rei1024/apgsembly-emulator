// @ts-check

import { $examples, $examplesDropdown } from "../bind.js";
import { scrollToTop } from "../util/scroll-to-top.js";

export const examplesData = [
    {
        name: "Unary register multiplication",
        src: "unary_multiply.apg",
    },
    {
        name: "Binary ruler",
        src: "binary_ruler.apg",
    },
    {
        name: "Integers",
        src: "integers.apg",
    },
    {
        name: "Primes",
        src: "primes.apg",
    },
    {
        name: "O(sqrt(log(t)))",
        src: "sqrt_log_t.apg",
    },
    {
        name: "Rule 90",
        src: "rule90.apg",
    },
    {
        name: "Rule 110",
        src: "rule110.apg",
    },
    {
        name: "Langton's ant",
        src: "ant2.apg",
    },
    {
        name: "Alien Counter",
        src: "alien_counter.apg",
    },
    {
        name: "Koch snowflake",
        src: "koch.apg",
    },
    {
        name: "99 Bottles of Beer",
        src: "99.apg",
    },
    {
        name: "π Calculator",
        src: "pi_calc.apg",
    },
];

// データ
const DATA_DIR = "./frontend/data/";

/**
 * @param {import('../app.js').App} app
 */
export function setupExamples(app) {
    for (const { name, src } of examplesData) {
        const $li = document.createElement("li");
        const $button = document.createElement("button");
        $button.classList.add("dropdown-item");
        $button.dataset["src"] = src;
        $button.textContent = name;
        $li.append($button);
        $examplesDropdown.append($li);

        $button.addEventListener("click", async () => {
            $examples.style.opacity = "0.5";
            try {
                const response = await fetch(DATA_DIR + src);
                if (!response.ok) {
                    throw Error("error");
                }
                app.setInputAndReset(await response.text());
                // スクロール
                scrollToTop();
            } catch (e) {
                throw e;
            } finally {
                $examples.removeAttribute("style");
            }
        });
    }
}
