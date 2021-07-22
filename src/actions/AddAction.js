// @ts-check

import { Action } from "./Action.js";

export const ADD_A1 = "A1";
export const ADD_B0 = "B0";
export const ADD_B1 = "B1";

const ADD_A1_STRING = "A1";
const ADD_B0_STRING = "B0";
const ADD_B1_STRING = "B1";

/**
 * @typedef {ADD_A1 | ADD_B0 | ADD_B1} AddOp
 */

/**
 * @typedef {ADD_A1_STRING | ADD_B0_STRING | ADD_B1_STRING} AddOpString
 */

/**
 * Action for `ADD`
 */
export class AddAction extends Action {
    /**
     * 
     * @param {AddOp} op 
     */
    constructor(op) {
        super();
        /**
         * @type {AddOp}
         * @readonly
         */
        this.op = op;
    }

    /**
     * @override
     */
    pretty() {
        return `ADD ${this.op}`;
    }

    /**
     * 文字列から変換する
     * @param {string} str 
     * @returns {AddAction | undefined}
     */
    static parse(str) {
        const array = str.trim().split(/\s+/);
        if (array.length !== 2) {
            return undefined;
        }
        const [ add, reg ] = array;
        if (add !== "ADD") {
            return undefined;
        }
        if (reg === ADD_A1_STRING || reg === ADD_B0_STRING || reg === ADD_B1_STRING) {
            return new AddAction(reg);
        }
        return undefined;
    }

    /**
     * @override
     */
    doesReturnValue() {
        switch (this.op) {
            case ADD_A1: return false;
            case ADD_B0: return true;
            case ADD_B1: return true;
        }
    }
}
