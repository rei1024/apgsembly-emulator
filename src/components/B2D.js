// @ts-check

import { B2DAction } from "../actions/B2DAction.js";
import {
    B2D_B2D,
    B2D_B2DX,
    B2D_B2DY,
    B2D_INC,
    B2D_READ,
    B2D_SET,
    B2D_TDEC,
} from "../action_consts/B2D_consts.js";
import { internalError } from "../internalError.js";

/**
 * @template A
 * @param {number} n
 * @param {(_: number) => A} f
 * @returns {A[]}
 */
const generateArray = (n, f) => Array(n).fill(0).map((_, i) => f(i));

/**
 * B2D
 * binary 2-dimensional
 */
export class B2D {
    constructor() {
        const x = 0; // 引数にできるが使用しないのでここで固定
        const y = 0;

        this.x = x;
        this.y = y;

        /**
         * @private
         */
        this.maxX = x;

        /**
         * @private
         */
        this.maxY = y;

        /**
         * @private
         * @type {(0 | 1)[][]}
         */
        this.array = generateArray(y + 1, () => generateArray(x + 1, () => 0));
    }

    /**
     * @returns {(0 | 1)[][]}
     */
    getArray() {
        return this.array;
    }

    /**
     * @returns {number}
     */
    getMaxX() {
        return this.maxX;
    }

    /**
     * @returns {number}
     */
    getMaxY() {
        return this.maxY;
    }

    /**
     * @param {B2DAction} act
     * @returns {0 | 1 | void}
     */
    action(act) {
        switch (act.op) {
            case B2D_INC: {
                switch (act.axis) {
                    case B2D_B2DX:
                        return this.incB2DX();
                    case B2D_B2DY:
                        return this.incB2DY();
                    case B2D_B2D:
                        internalError();
                }
                break;
            }
            case B2D_TDEC: {
                switch (act.axis) {
                    case B2D_B2DX:
                        return this.tdecB2DX();
                    case B2D_B2DY:
                        return this.tdecB2DY();
                    case B2D_B2D:
                        internalError();
                }
                break;
            }
            case B2D_READ: {
                switch (act.axis) {
                    case B2D_B2D:
                        return this.read();
                    default:
                        internalError();
                }
                break;
            }
            case B2D_SET: {
                switch (act.axis) {
                    case B2D_B2D:
                        return this.set();
                    default:
                        internalError();
                }
                break;
            }
            default: {
                internalError();
            }
        }
    }

    /**
     * `INC B2DX`
     * @returns {void}
     */
    incB2DX() {
        this.x++;
        if (this.maxX < this.x) {
            for (const a of this.array) {
                a.push(0);
            }
            this.maxX = this.x;
        }
    }

    /**
     * `INC B2DY`
     * @returns {void}
     */
    incB2DY() {
        this.y++;
        if (this.maxY < this.y) {
            this.array.push(generateArray(this.maxX + 1, () => 0));
            this.maxY = this.y;
        }
    }

    /**
     * `TDEC B2DX`
     * @returns {0 | 1}
     */
    tdecB2DX() {
        if (this.x === 0) {
            return 0;
        } else {
            this.x--;
            return 1;
        }
    }

    /**
     * `TDEC B2DY`
     * @returns {0 | 1}
     */
    tdecB2DY() {
        if (this.y === 0) {
            return 0;
        } else {
            this.y--;
            return 1;
        }
    }

    /**
     * `READ B2D`
     * @returns {0 | 1}
     */
    read() {
        const arrayY = this.array[this.y];
        if (arrayY === undefined) {
            internalError();
        }
        const value = arrayY[this.x];
        if (value === undefined) {
            internalError();
        }
        arrayY[this.x] = 0;
        return value;
    }

    /**
     * `SET B2D`
     * @returns {void}
     */
    set() {
        const arrayY = this.array[this.y] ?? internalError();
        if (arrayY[this.x] === 1) {
            throw Error(
                `SET B2D: Tried to set when it was already 1. x = ${this.x}, y = ${this.y}`,
            );
        }
        arrayY[this.x] = 1;
    }
}
