// @ts-check

const CLOCK_PREFIX = "CLOCK-2^";

/**
 * @param {string} content `B0-5, U0-5, U8-9, ADD, SUB, MUL, OUTPUT`
 * @returns {string[]} `["B0", "B1", "B2", ..., "OUTPUT"]`
 */
export function parseComponentsHeader(content) {
    /** @type {string[]} */
    const components = [];
    const strArray = content.split(",").map((x) => x.trim());
    for (const str of strArray) {
        if (str === "...") {
            continue;
        }
        if (str === "NOP" || str === "HALT_OUT") {
            continue;
        }
        if (
            str === "OUTPUT" || str === "B2D" || str === "PRINTER" ||
            str === "ADD" ||
            str === "SUB" || str === "MUL"
        ) {
            components.push(str);
        } else if (str.startsWith(CLOCK_PREFIX)) {
            const _clockPeriod = Number(str.slice(CLOCK_PREFIX.length));
        } else {
            const register = str.startsWith("B")
                ? "B"
                : (str.startsWith("U") ? "U" : null);
            if (register) {
                const numList = parseRange(str.slice(1));
                for (const x of numList.map((x) => `${register}${x}`)) {
                    components.push(x);
                }
            }
        }
    }

    return components;
}

/**
 * @param {string} rangeStr `0`, `0-6`
 * @returns {number[]}
 */
function parseRange(rangeStr) {
    const range = rangeStr.split("-");
    if (range.length === 1) {
        const numStr = range[0];
        if (numStr?.length === 0) {
            throw new Error("Invalid #COMPONENTS");
        }
        const num = Number(numStr);
        if (Number.isNaN(num)) {
            throw new Error("Invalid #COMPONENTS");
        }
        return [num];
    } else if (range.length === 2) {
        if (range.some((x) => x.length === 0)) {
            throw new Error("Invalid #COMPONENTS");
        }
        const [start, end] = range.map((x) => Number(x));
        if (
            start == null || end == null || Number.isNaN(start) ||
            Number.isNaN(end)
        ) {
            throw new Error("Invalid #COMPONENTS");
        }

        if (start >= 100 || end >= 100) {
            throw new Error(
                "Invalid #COMPONENTS: range declaration must be less than 100",
            );
        }

        const res = [];
        for (let i = start; i < end + 1; i++) {
            res.push(i);
        }
        return res;
    }

    throw new Error("Invalid #COMPONENTS");
}
