// @ts-check

import { create } from "../util/create.js";

/**
 * ブレークポイント初期化
 * @param {HTMLSelectElement} $breakpointSelect
 * @param {Map<string, number> | undefined} stateMap
 */
export function initializeBreakpointSelect($breakpointSelect, stateMap) {
    $breakpointSelect.innerHTML = "";
    if (stateMap === undefined) {
        return;
    }

    const none = create("option", "None");
    none.value = "-1";
    none.selected = true;
    $breakpointSelect.append(none);

    for (const [state, stateIndex] of stateMap) {
        const option = create("option", state);
        option.value = stateIndex.toString();
        $breakpointSelect.append(option);
    }
}

/**
 * 入力
 * @param {HTMLSelectElement} $breakpointInputSelect
 * @returns {-1 | 0 | 1} -1 is any
 */
export function getBreakpointInput($breakpointInputSelect) {
    // -1: *
    // 0 : Z
    // 1 : NZ
    switch ($breakpointInputSelect.value) {
        case "*":
            return -1;
        case "Z":
            return 0;
        // "NZ"
        default:
            return 1;
    }
}
