// @ts-check

import { Action } from "./Action.js";

export const B_INC = "INC";
export const B_TDEC = "TDEC";
export const B_READ = "READ";
export const B_SET = "SET";

const B_INC_STRING = "INC";
const B_TDEC_STRING = "TDEC";
const B_READ_STRING = "READ";
const B_SET_STRING = "SET";

/**
 * @typedef {B_INC | B_TDEC | B_READ | B_SET} BOp
 */

/**
 * Action for `Bn`
 */
export class BRegAction extends Action {
    /**
     * 
     * @param {BOp} op 
     * @param {number} regNumber 
     */
    constructor(op, regNumber) {
        super();
        /**
         * @type {BOp}
         * @readonly
         */
        this.op = op;
        /**
         * @readonly
         */
        this.regNumber = regNumber;
    }

    /**
     * @override
     * @returns {number[]}
     */
    extractBinaryRegisterNumbers() {
        return [this.regNumber]
    }

    /**
     * @override
     */
    pretty() {
        return `${this.op} B${this.regNumber}`;
    }

    /**
     * @param {string} str
     * @returns {BRegAction | undefined}
     */
    static parse(str) {
        const array = str.trim().split(/\s+/);
        if (array.length !== 2) {
            return undefined;
        }
        const [ op, reg ] = array;
        if (op === undefined || reg === undefined) { return undefined; }
        if (op === B_INC_STRING || op === B_TDEC_STRING || op === B_READ_STRING || op === B_SET_STRING) {
            if (reg.startsWith("B")) {
                const str = reg.slice(1);
                if (/^[0-9]+$/.test(str)) {
                    return new BRegAction(op, parseInt(str, 10));
                }
            }
        }
        return undefined;
    }

    /**
     * @override
     */
    doesReturnValue() {
        switch (this.op) {
            case B_INC: return false;
            case B_TDEC: return true;
            case B_READ: return true;
            case B_SET: return false;
        }
    }
}
