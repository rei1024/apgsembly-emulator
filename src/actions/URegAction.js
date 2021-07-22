// @ts-check

import { Action } from "./Action.js";

export const U_INC = "INC";
export const U_TDEC = "TDEC";

const U_INC_STRING = "INC";
const U_TDEC_STRING = "TDEC";

/**
 * Action for `Un`
 */
export class URegAction extends Action {
    /**
     * 
     * @param {U_INC | U_TDEC} op 
     * @param {number} regNumber
     */
    constructor(op, regNumber) {
        super();
        /**
         * @type {U_INC | U_TDEC}
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
    extractUnaryRegisterNumbers() {
        return [this.regNumber];
    }

    /**
     * @override
     */
    pretty() {
        return `${this.op} U${this.regNumber}`;
    }

    /**
     * 
     * @param {string} str
     * @returns {URegAction | undefined}
     */
    static parse(str) {
        const array = str.trim().split(/\s+/);
        if (array.length !== 2) {
            return undefined;
        }
        const [ op, reg ] = array;
        if (op === undefined || reg === undefined) { return undefined; }
        if (op === U_INC_STRING || op === U_TDEC_STRING) {
            // R for APGsembly 1.0
            if (reg.startsWith("U") || reg.startsWith('R')) {
                const str = reg.slice(1);
                if (/^[0-9]+$/.test(str)) {
                    return new URegAction(op, parseInt(str, 10));
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
            case U_INC: return false;
            case U_TDEC: return true;
        }
    }
}
