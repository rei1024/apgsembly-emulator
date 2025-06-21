// @ts-check

/**
 * @param {ReadonlyArray<0 | 1>} bits
 * @returns {string}
 * @example
 * > toBinaryStringReverse([0, 1])
 * "10"
 */
export const toBinaryStringReverse = (bits) => {
    // faster than `bits.slice().reverse().join("")`
    let str = "";
    for (let i = bits.length - 1; i >= 0; i--) {
        str += bits[i] === 0 ? "0" : "1";
    }
    return str;
};

/**
 * @param {(0 | 1)[]} bits
 * @returns {string}
 */
export const toBinaryString = (bits) => {
    let str = "";
    const len = bits.length;
    for (let i = 0; i < len; i++) {
        str += bits[i] === 0 ? "0" : "1";
    }
    return str;
};

const hasBigInt = typeof BigInt !== "undefined";

/**
 * @param {(0 | 1)[]} bits
 * @param {number} base
 * @returns
 */
export function toNumberString(bits, base) {
    return (hasBigInt ? BigInt : Number)(
        "0b" + toBinaryStringReverse(bits),
    )
        .toString(base);
}
