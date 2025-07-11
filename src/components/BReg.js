// @ts-check

import { BRegAction } from "../actions/BRegAction.js";
import { B_INC, B_READ, B_SET, B_TDEC } from "../action_consts/BReg_consts.js";
import { internalError } from "../internalError.js";
import { throwRegisterInitError } from "./UReg.js";

/**
 * バイナリの文字列を0と1の配列に変換する
 * @param {string} str `'01011'`
 * @returns {(0 | 1)[]} `[0, 1, 0, 1, 1]`
 * @throws
 */
const parseBits = (str) => {
    return [...str].map((c) => {
        if (c === "0") {
            return 0;
        } else if (c === "1") {
            return 1;
        } else {
            throw Error(`Invalid #REGISTERS: "${str}"`);
        }
    });
};

const hasBigInt = typeof BigInt !== "undefined";

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

/**
 * Bn: Binary Register
 */
export class BReg {
    constructor() {
        // invariant: this.pointer < this.bits.length
        this.pointer = 0;

        /**
         * @private
         * @type {(0 | 1)[]}
         */
        this.bits = [0];
    }

    /**
     * @param {BRegAction} act
     * @returns {0 | 1 | void}
     */
    action(act) {
        // if (this.pointer >= this.bits.length) {
        //     throw Error('failed');
        // }
        switch (act.op) {
            // INC  3207502
            // TDEC 3217502
            // READ 3175344
            // SET   406844
            case B_TDEC: {
                if (this.pointer === 0) {
                    return 0;
                } else {
                    this.pointer--;
                    return 1;
                }
            }
            case B_INC: {
                const newPointer = this.pointer + 1;
                this.pointer = newPointer;
                // using invariant
                const bits = this.bits;
                if (newPointer === bits.length) {
                    bits.push(0);
                }
                break;
            }
            case B_READ: {
                const pointer = this.pointer;
                const bits = this.bits;
                if (pointer < bits.length) {
                    const value = bits[pointer] ?? internalError();
                    bits[pointer] = 0;
                    return value;
                } else {
                    return 0;
                }
            }
            case B_SET: {
                const bits = this.bits;
                const pointer = this.pointer;
                if (pointer >= bits.length) {
                    this.extend();
                }
                const value = bits[pointer];
                if (value === 1) {
                    throw Error(
                        `The bit of the binary register B${act.regNumber} is already 1`,
                    );
                }
                bits[pointer] = 1;
                break;
            }
            default: {
                /** @type {never} */
                const _ = act.op;
            }
        }
    }

    /**
     * @param {BRegAction} act
     * @param {number} n
     */
    actionN(act, n) {
        switch (act.op) {
            case B_INC: {
                this.pointer += n;
                this.extend();
                break;
            }
            case B_TDEC: {
                this.pointer -= n;
                break;
            }
            default: {
                throw Error("todo");
            }
        }
    }

    /**
     * @returns {(0 | 1)[]}
     */
    getBits() {
        return this.bits;
    }

    /**
     * @param {(0 | 1)[]} bits
     */
    setBits(bits) {
        this.bits = bits;
    }

    /**
     * `INC Bn`
     * @returns {void}
     */
    inc() {
        const value = this.action(new BRegAction(B_INC, 0)); // regNumberは仮
        if (value !== undefined) {
            internalError();
        }
        return value;
    }

    /**
     * `TDEC Bn`
     * @returns {0 | 1}
     */
    tdec() {
        const value = this.action(new BRegAction(B_TDEC, 0)); // regNumberは仮
        if (value === undefined) {
            internalError();
        }
        return value;
    }

    /**
     * `READ Bn`
     * @returns {0 | 1}
     */
    read() {
        const value = this.action(new BRegAction(B_READ, 0)); // regNumberは仮
        if (value === undefined) {
            internalError();
        }
        return value;
    }

    /**
     * `SET Bn`
     * @returns {void}
     */
    set() {
        const value = this.action(new BRegAction(B_SET, 0)); // regNumberは仮
        if (value !== undefined) {
            internalError();
        }
        return value;
    }

    /**
     * ポインターの範囲までメモリを広げる
     */
    extend() {
        const pointer = this.pointer;
        const bits = this.bits;
        const len = bits.length;
        if (pointer >= len) {
            if (pointer === len) {
                bits.push(0);
            } else {
                /**
                 * @type {0[]}
                 */
                const rest = Array(pointer - len + 1).fill(0).map(() => 0);
                this.bits = this.bits.concat(rest);
            }
        }
    }

    /**
     * @param {number} [base] default is 10
     */
    toNumberString(base = 10) {
        return (hasBigInt ? BigInt : Number)(
            "0b" + toBinaryStringReverse(this.bits),
        )
            .toString(base);
    }

    /**
     * prefixとsuffixがsliceされていることは保証する
     * @returns {{
     *   prefix: (0 | 1)[];
     *   head: 0 | 1;
     *   suffix: (0 | 1)[];
     * }}
     */
    toObject() {
        this.extend();
        const bits = this.bits;
        const pointer = this.pointer;
        return {
            prefix: bits.slice(0, pointer),
            head: bits[pointer] ?? internalError(),
            suffix: bits.slice(pointer + 1),
        };
    }

    /**
     * @param {string} key
     * @param {unknown} value
     */
    setByRegistersInit(key, value) {
        // 数字の場合の処理は数字をバイナリにして配置する
        if (typeof value === "number") {
            this.setBits(parseBits(value.toString(2)).reverse());
            this.extend();
        } else if (!Array.isArray(value) || value.length !== 2) {
            throwRegisterInitError(key, value);
        } else {
            const [value0, value1] = /** @type {unknown[]} */ (value);

            if (
                typeof value0 !== "number" || typeof value1 !== "string" ||
                value0 < 0 || !Number.isInteger(value0)
            ) {
                throwRegisterInitError(key, value);
            } else {
                const bits = parseBits(value1);
                this.pointer = value0;
                this.setBits(bits);
                this.extend();
            }
        }
    }
}
