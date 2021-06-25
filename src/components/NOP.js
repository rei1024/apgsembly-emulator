
// @ts-check
import { NopAction } from "../actions/NopAction.js";

export class NOP {
    constructor() {

    }

    /**
     * 
     * @param {NopAction} _act 
     * @returns {0}
     */
    action(_act) {
        return this.nop();
    }

    /**
     * 
     * @returns {0}
     */
    nop() {
        return 0;
    }
}
