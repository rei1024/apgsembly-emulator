// @ts-check

import { SubAction } from "../actions/SubAction.js";
import { SUB_A1, SUB_B0, SUB_B1 } from "../action_consts/Sub_consts.js";
import { internalError } from "../internalError.js";

/**
 * `SUB`
 */
export class SUB {
    constructor() {
        /**
         * 0 ~ 3
         * @private
         */
        this.value = 0;
    }

    /**
     * @param {SubAction} act
     */
    action(act) {
        switch (act.op) {
            // A1  176960
            // B0 1902824
            // B1  172184
            case SUB_B0: {
                return this.b0();
            }
            case SUB_A1: {
                return this.a1();
            }
            case SUB_B1: {
                return this.b1();
            }
            default: {
                internalError();
            }
        }
    }

    /**
     * @returns {number}
     */
    getValue() {
        return this.value;
    }

    /**
     * `SUB A1`
     * @returns {undefined}
     */
    a1() {
        this.value = (this.value + 1) % 4;
    }

    /**
     * `SUB B0`
     * @returns {0 | 1}
     */
    b0() {
        const value = this.value;
        const t = /** @type {0 | 1} */ (value % 2);
        this.value = value >= 2 ? 3 : 0;
        return t;
    }

    /**
     * `SUB B1`
     * @returns {0 | 1}
     */
    b1() {
        const value = this.value;
        const t = /** @type {0 | 1} */ (1 - value % 2);
        this.value = value === 0 || value === 3 ? 3 : 0;
        return t;
    }

    /**
     * @returns {string}
     */
    toString() {
        return this.value.toString(2).padStart(2, "0");
    }

    /**
     * @returns {string}
     */
    toStringDetail() {
        return this.toString();
    }
}
