// @ts-check

import { Action } from "./Action.js";

export const B2D_INC = "INC";
export const B2D_TDEC = "TDEC";
export const B2D_READ = "READ";
export const B2D_SET = "SET";
export const B2D_B2DX = "B2DX";
export const B2D_B2DY = "B2DY";
export const B2D_B2D = "B2D";

const B2D_INC_STRING = "INC";
const B2D_TDEC_STRING = "TDEC";
const B2D_READ_STRING = "READ";
const B2D_SET_STRING = "SET";
const B2D_B2DX_STRING = "B2DX";
const B2D_B2DY_STRING = "B2DY";
const B2D_B2D_STRING = "B2D";

/**
 * Action for `B2D`
 */
export class B2DAction extends Action {
    /**
     * 
     * @param {B2D_INC | B2D_TDEC | B2D_READ | B2D_SET} op 
     * @param {B2D_B2DX | B2D_B2DY | B2D_B2D} axis
     */
    constructor(op, axis) {
        super();
        /**
         * @readonly
         */
        this.op = op;
        /**
         * @readonly
         */
        this.axis = axis;
    }

    /**
     * @override
     */
    pretty() {
        return `${this.op} ${this.axis}`;
    }

    /**
     * 
     * @param {string} str 
     */
    static parse(str) {
        const array = str.trim().split(/\s+/);
        if (array.length !== 2) {
            return undefined;
        }
        let [ op, axis ] = array;
        if (op === undefined || axis === undefined) { return undefined; }
        if (op === B2D_INC_STRING || op === B2D_TDEC_STRING) {
            if (axis === B2D_B2DX_STRING || axis === B2D_B2DY_STRING) {
                return new B2DAction(op, axis);
            }
        } else if (op === B2D_READ_STRING || op === B2D_SET_STRING) {
            if (axis === B2D_B2D_STRING) {
                return new B2DAction(op, axis);
            }
        }
        // APGsembly 1.0
        // TODO: use constant
        if (op === "INC" || op === "DEC") {
            if (op === "DEC") {
                // rename
                op = "TDEC";
            }
            if (axis === "SQX") {
                return new B2DAction(
                    // @ts-ignore
                    op
                    , B2D_B2DX);
            } else if (axis === "SQY") {
                return new B2DAction(
                    // @ts-ignore
                    op,
                    B2D_B2DY);
            }
        } else if (op === "READ" || op === "SET") {
            if (axis === "SQ") {
                return new B2DAction(op, B2D_B2D);
            }
        }
        return undefined;
    }
}
