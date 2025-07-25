// @ts-check

import { internalError } from "../../src/internalError.js";

/**
 * @returns {number[]}
 */
const getFrequencies = () => {
    /** @type {number[]} */
    const frequencyArray = [];
    const maxOrder = 6;
    for (let i = 0; i <= maxOrder; i++) {
        for (const j of [1, ...i === 0 ? [] : [1.5], 2, 3, 5, 8]) {
            frequencyArray.push(j * (10 ** i));
        }
    }

    // 値を追加したらHTMLも変更すること
    frequencyArray.push(
        10 * 10 ** maxOrder,
        15 * 10 ** maxOrder,
        20 * 10 ** maxOrder,
    );

    // Math.floor ensures element kind is PACKED_SMI_ELEMENTS
    return frequencyArray.map((x) => Math.floor(x));
};

/**
 * 周波数入力
 * @param {HTMLInputElement} $frequencyInput
 * @param {import("../app.js").App} app
 */
export function setupFrequencyInput($frequencyInput, app) {
    const frequencies = getFrequencies();

    $frequencyInput.min = "0";
    $frequencyInput.max = (frequencies.length - 1).toString();

    function update() {
        const value = parseInt($frequencyInput.value, 10);
        const freq = frequencies[value] ?? internalError();
        $frequencyInput.ariaValueText = `(${freq.toString()}Hz)`;
        app.setFrequency(freq);
    }

    $frequencyInput.addEventListener("input", () => {
        update();
    });

    // タブの複製で設定されることがあるため。
    setTimeout(() => {
        update();
    }, 1);
}
