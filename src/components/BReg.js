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
 * @param {Uint8Array} bits
 * @returns {string}
 * @example
 * > toBinaryStringReverse([0, 1])
 * "10"
 */
const toBinaryStringReverseUint8 = (bits) => {
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
        this.pointer = 0;
        /**
         * @private
         * @type {Uint8Array}
         */
        this.bits = new Uint8Array(1);

        /**
         * 有効なビット数
         * @private
         * @type {number}
         */
        this.length = 1;
    }

    /**
     * @param {BRegAction} act
     * @returns {0 | 1 | undefined}
     */
    action(act) {
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
                if (newPointer >= this.length) {
                    this.extend();
                }
                return undefined;
            }
            case B_READ: {
                const pointer = this.pointer;
                if (pointer < this.length) {
                    const bits = this.bits;
                    const value = bits[pointer] ?? internalError();
                    bits[pointer] = 0;
                    return /** @type {0 | 1} */ (value);
                } else {
                    return 0;
                }
            }
            case B_SET: {
                const pointer = this.pointer;
                if (pointer >= this.length) {
                    this.extend();
                }
                const bits = this.bits;
                const value = bits[pointer];
                if (value === 1) {
                    throw Error(
                        `The bit of the binary register B${act.regNumber} is already 1`,
                    );
                }
                bits[pointer] = 1;
                return undefined;
            }
            default: {
                /** @type {never} */
                const _ = act.op;
                return undefined; // unreachable
            }
        }
    }

    /**
     * @param {BRegAction} act
     * @param {number} n
     * @returns {undefined}
     */
    actionN(act, n) {
        switch (act.op) {
            case B_INC: {
                this.pointer += n;
                if (this.pointer >= this.length) {
                    this.extend();
                }
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
        return /** @type {(0 | 1)[]} */ (Array.from(
            this.bits.slice(0, this.length),
        ));
    }

    /**
     * @param {(0 | 1)[]} bits
     * @private
     */
    setBits(bits) {
        this.length = bits.length;
        this.bits = new Uint8Array(Math.max(1, bits.length));
        for (let i = 0; i < bits.length; i++) {
            const value = bits[i];
            if (value !== undefined) {
                this.bits[i] = value;
            }
        }
    }

    /**
     * `INC Bn`
     * @returns {undefined}
     */
    inc() {
        const value = this.action(new BRegAction(B_INC, 0)); // regNumberは仮
        if (value !== undefined) {
            internalError();
        }
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
     * @returns {undefined}
     */
    set() {
        const value = this.action(new BRegAction(B_SET, 0)); // regNumberは仮
        if (value !== undefined) {
            return internalError();
        }
    }

    /**
     * ポインターの範囲までメモリを広げる
     */
    extend() {
        const pointer = this.pointer;
        const bits = this.bits;
        const bitsLength = bits.length;
        // pointerが容量を超えた場合、2倍で再アロケート
        if (pointer >= bitsLength) {
            let newCapacity = bitsLength * 2;
            while (pointer >= newCapacity) {
                newCapacity *= 2;
            }
            const newBits = new Uint8Array(newCapacity);
            newBits.set(this.bits);
            this.bits = newBits;
        }
        // 有効なビット数(length)も更新
        if (pointer >= this.length) {
            this.length = pointer + 1;
        }
    }

    /**
     * @param {number} [base] default is 10
     */
    toNumberString(base = 10) {
        return (hasBigInt ? BigInt : Number)(
            "0b" + toBinaryStringReverseUint8(this.bits.slice(0, this.length)),
        ).toString(base);
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
        const bitsArray = /** @type {(0 | 1)[]} */ (Array.from(
            this.bits.slice(0, this.length),
        ));
        const pointer = this.pointer;
        return {
            prefix: bitsArray.slice(0, pointer),
            head: bitsArray[pointer] ?? internalError(),
            suffix: bitsArray.slice(pointer + 1),
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
