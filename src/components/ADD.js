// @ts-check

import { AddAction } from "../actions/AddAction.js";
import { ADD_A1, ADD_B0, ADD_B1 } from "../action_consts/Add_consts.js";
import { internalError } from "../internalError.js";

/**
 * ADD
 */
export class ADD {
    constructor() {
        /**
         * 0 ~ 3
         * @type {number}
         * @private
         */
        this.value = 0;
    }

    /**
     * @param {AddAction} act
     * @returns {0 | 1 | undefined}
     */
    action(act) {
        switch (act.op) {
            // A1 479061
            // B1 535537
            // B0 4135003
            case ADD_B0: {
                const value = this.value;
                const t = value % 2;

                this.value = value >>> 1;
                // @ts-ignore
                return t;
            }
            case ADD_B1: {
                const value = this.value;
                const t = 1 - value % 2;

                this.value = value === 1 || value === 2 ? 1 : 0;
                // @ts-ignore
                return t;
            }
            case ADD_A1: {
                this.value = (this.value + 1) % 4;
                return undefined;
            }
            default:
                internalError();
        }
    }

    /**
     * @returns {number}
     */
    getValue() {
        return this.value;
    }

    /**
     * `ADD A1`
     * @returns {undefined}
     */
    a1() {
        this.action(new AddAction(ADD_A1));
        return undefined;
    }

    /**
     * `ADD B0`
     * @returns {0 | 1}
     */
    b0() {
        const t = this.action(new AddAction(ADD_B0));
        if (t === undefined) {
            internalError();
        }
        return t;
    }

    /**
     * `ADD B1`
     * @returns {0 | 1}
     */
    b1() {
        const t = this.action(new AddAction(ADD_B1));
        if (t === undefined) {
            internalError();
        }
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
