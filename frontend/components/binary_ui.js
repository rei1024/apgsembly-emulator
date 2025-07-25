// @ts-check

import {
    BReg,
    toBinaryString,
    toBinaryStringReverse,
} from "../../src/components/BReg.js";
import { internalError } from "../../src/internalError.js";
import { create } from "../util/create.js";

// ```
// <table>
// <tr>
//     <th>B1</th>
//     <td>
//         <code style="color: black;">
//             <span class="decimal">value = 3432</span><span class="pointer">, pointer = 12</span>
//         </code>
//         <br>
//         <code style="word-break: break-all">
//             <span class="prefix">110011010</span><span class="head" style="border-bottom: 3px solid #0D47A1; color: #0D47A1;">1</span><span class="suffix">101101001</span>
//         </code>
//     </td>
// </tr>
// </table>
// ```

/**
 * value = ..., hex = ..., pointer = ...
 */
const createMetaElem = () => {
    const $decimal = create("span", { classes: ["decimal"] });
    const $hex = create("span", { classes: ["hex"] });
    const $maxPointer = create("span", { classes: ["max_pointer"] });
    const $pointer = create("span", { classes: ["pointer"] });

    const metaData = create("code", {
        classes: ["binary_info", "word-break-all"], // style.cssで設定
        children: [$decimal, $hex, $maxPointer, $pointer],
    });

    return { metaData, $decimal, $hex, $maxPointer, $pointer };
};

/**
 * バイナリ表示
 */
const createBinaryElem = () => {
    const $prefix = create("span", { classes: ["prefix"] });
    const $head = create("span", { classes: ["binary-head"] });
    const $suffix = create("span", { classes: ["suffix"] });

    const binaryBits = create("code", {
        classes: ["word-break-all"],
        children: [$prefix, $head, $suffix],
    });

    return { binaryBits, $prefix, $head, $suffix };
};

/**
 * UI for binary registers
 */
export class BinaryUI {
    /**
     * @type {HTMLElement}
     */
    #root;
    /**
     * @type {{
     * $decimal: HTMLElement,
     * $hex: HTMLElement,
     * $maxPointer: HTMLElement,
     * $pointer: HTMLElement,
     * $prefix: HTMLElement,
     * $head: HTMLElement,
     * $suffix: HTMLElement
     * }[]}
     */
    #cells;
    /**
     * @param {HTMLElement} root
     */
    constructor(root) {
        this.#root = root;
        this.#cells = [];
    }

    /**
     * initialize DOM
     * @param {ReadonlyMap<number, BReg>} regs
     */
    initialize(regs) {
        this.clear();

        const cells = [];
        const table = create("table");
        for (const key of regs.keys()) {
            const td = create("td");
            td.dataset["test"] = `B${key}`; // for e2e

            // meta
            const { metaData, $decimal, $hex, $maxPointer, $pointer } =
                createMetaElem();
            td.append(metaData, create("br"));

            // binary
            const { binaryBits, $prefix, $head, $suffix } = createBinaryElem();
            td.append(binaryBits);

            const tr = create("tr", {
                children: [create("th", `B${key}`), td],
            });
            table.append(tr);
            cells.push({
                $decimal,
                $hex,
                $maxPointer,
                $pointer,
                $prefix,
                $head,
                $suffix,
            });
        }

        this.#root.append(table);
        this.#cells = cells;
    }

    clear() {
        this.#cells = [];
        this.#root.innerHTML = "";
    }

    /**
     * @param {ReadonlyMap<number, BReg>} regs
     * @param {boolean} hideBits
     * @param {boolean} reverseBits
     * @param {boolean} showBinaryValueInDecimal
     * @param {boolean} showBinaryValueInHex
     */
    render(
        regs,
        hideBits,
        reverseBits,
        showBinaryValueInDecimal,
        showBinaryValueInHex,
    ) {
        let i = 0;
        const cells = this.#cells;
        for (const reg of regs.values()) {
            const {
                $prefix,
                $head,
                $suffix,
                $decimal,
                $hex,
                $maxPointer,
                $pointer,
            } = cells[i] ?? internalError();

            if (hideBits) {
                $prefix.innerHTML = "";
                $head.innerHTML = "";
                $suffix.innerHTML = "";
            } else {
                const obj = reg.toObject();
                $prefix.textContent = reverseBits
                    ? toBinaryStringReverse(obj.suffix)
                    : toBinaryString(obj.prefix);
                $head.textContent = obj.head.toString();
                $suffix.textContent = reverseBits
                    ? toBinaryStringReverse(obj.prefix)
                    : toBinaryString(obj.suffix);
            }

            if (showBinaryValueInDecimal) {
                $decimal.textContent = "value = " + reg.toNumberString(10) +
                    ", ";
            } else {
                $decimal.innerHTML = "";
            }

            if (showBinaryValueInHex) {
                $hex.textContent = "hex = " + reg.toNumberString(16) + ", ";
            } else {
                $hex.innerHTML = "";
            }

            $maxPointer.textContent = "max_pointer = " +
                (reg.getLength() - 1) +
                ", ";

            $pointer.textContent = "pointer = " + reg.pointer.toString();
            i++;
        }
    }
}
