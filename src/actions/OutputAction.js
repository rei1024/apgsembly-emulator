// @ts-check

import { Action } from "./Action.js";

const OUTPUT_STRING = "OUTPUT";

/**
 * `OUTPUT`
 */
export class OutputAction extends Action {
    /**
     * @param {string} digit
     */
    constructor(digit) {
        super();

        /**
         * @readonly
         */
        this.digit = digit;
    }

    /**
     * @override
     * @returns {string}
     */
    pretty() {
        return `${OUTPUT_STRING} ${this.digit}`;
    }

    /**
     * @param {string} str
     * @returns {OutputAction | undefined}
     */
    static parse(str) {
        const array = str.trim().split(" ");
        if (array.length !== 2) {
            return undefined;
        }
        const [output, digit] = array;
        if (output !== OUTPUT_STRING) {
            return undefined;
        }
        if (digit === undefined) {
            return undefined;
        }
        return new OutputAction(digit);
    }

    /**
     * @override
     */
    doesReturnValue() {
        return false;
    }

    /**
     * @override
     * @param {Action} action
     * @returns {boolean}
     */
    isSameComponent(action) {
        return action instanceof OutputAction;
    }
}
