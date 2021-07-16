// @ts-check

import { Action } from "./Action.js";

export const ADD_A1 = "A1";
export const ADD_B0 = "B0";
export const ADD_B1 = "B1";

const ADD_A1_STRING = "A1";
const ADD_B0_STRING = "B0";
const ADD_B1_STRING = "B1";

/**
 * Action for `ADD`
 */
export class AddAction extends Action {
    /**
     * 
     * @param {ADD_A1 | ADD_B0 | ADD_B1} regName 
     */
    constructor(regName) {
        super();
        /**
         * @readonly
         */
        this.regName = regName;
    }

    /**
     * @override
     */
    pretty() {
        return `ADD ${this.regName}`;
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
}
