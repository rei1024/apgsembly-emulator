// @ts-check

import { U_INC, U_TDEC } from "../action_consts/UReg_consts.js";
import { Action } from "./Action.js";

const U_INC_STRING = "INC";
const U_TDEC_STRING = "TDEC";

const U_STRING = "U";
const R_STRING = "R";

/**
 * @typedef {U_INC | U_TDEC} UOp
 */

/**
 * @typedef {U_INC_STRING | U_TDEC_STRING} UOpString
 */

/**
 * @param {UOp} op
 * @returns {UOpString}
 */
const prettyOp = (op) => {
    switch (op) {
        case U_INC:
            return U_INC_STRING;
        case U_TDEC:
            return U_TDEC_STRING;
    }
};

/**
 * @param {UOpString} op
 * @returns {UOp}
 */
const parseOp = (op) => {
    switch (op) {
        case U_INC_STRING:
            return U_INC;
        case U_TDEC_STRING:
            return U_TDEC;
    }
};

/**
 * Action for `Un`
 */
export class URegAction extends Action {
    /**
     * @param {UOp} op
     * @param {number} regNumber
     */
    constructor(op, regNumber) {
        super();

        /**
         * @type {UOp}
         * @readonly
         */
        this.op = op;

        /**
         * @readonly
         */
        this.regNumber = regNumber;

        /**
         * @type {import('../components/UReg.js').UReg | undefined}
         */
        this.registerCache = undefined;
    }

    /**
     * @override
     */
    pretty() {
        return `${prettyOp(this.op)} ${U_STRING}${this.regNumber}`;
    }

    /**
     * @param {string} str
     * @returns {URegAction | undefined}
     */
    static parse(str) {
        const array = str.trim().split(" ");
        if (array.length !== 2) {
            return undefined;
        }

        const [op, reg] = array;
        if (op === undefined || reg === undefined) {
            return undefined;
        }

        if (op === U_INC_STRING || op === U_TDEC_STRING) {
            // R for APGsembly 1.0
            if (reg.startsWith(U_STRING) || reg.startsWith(R_STRING)) {
                const str = reg.slice(1);
                if (/^[0-9]+$/u.test(str)) {
                    return new URegAction(parseOp(op), parseInt(str, 10));
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
            case U_INC:
                return false;
            case U_TDEC:
                return true;
        }
    }

    /**
     * @override
     * @param {Action} action
     * @returns {boolean}
     */
    isSameComponent(action) {
        if (action instanceof URegAction) {
            return this.regNumber === action.regNumber;
        } else {
            return false;
        }
    }
}
