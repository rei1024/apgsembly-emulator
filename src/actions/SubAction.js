// @ts-check

import { Action } from "./Action.js";

export const SUB_A1 = "A1";
export const SUB_B0 = "B0";
export const SUB_B1 = "B1";

const SUB_A1_STRING = "A1";
const SUB_B0_STRING = "B0";
const SUB_B1_STRING = "B1";

/**
 * @typedef {SUB_A1 | SUB_B0 | SUB_B1} SubOp
 */

/**
 * @typedef {SUB_A1_STRING | SUB_B0_STRING | SUB_B1_STRING} SubOpString
 */

/**
 * Action for `SUB`
 */
export class SubAction extends Action {
    /**
     * 
     * @param {SubOp} op 
     */
    constructor(op) {
        super();
        /**
         * @type {SubOp}
         * @readonly
         */
        this.op = op;
    }

    /**
     * @override
     */
    pretty() {
        return `SUB ${this.op}`;
    }

    /**
     * 
     * @param {string} str 
     * @returns {SubAction | undefined}
     */
    static parse(str) {
        const array = str.trim().split(/\s+/);
        if (array.length !== 2) {
            return undefined;
        }
        const [ sub, reg ] = array;
        if (sub !== "SUB") {
            return undefined;
        }
        if (reg === SUB_A1_STRING || reg === SUB_B0_STRING || reg === SUB_B1_STRING) {
            return new SubAction(reg);
        }
        return undefined;
    }

    /**
     * 
     * @returns @override
     */
    doesReturnValue() {
        switch (this.op) {
            case SUB_A1: return false;
            case SUB_B0: return true;
            case SUB_B1: return true;
        }
    }
}
