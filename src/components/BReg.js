// @ts-check

import { BRegAction } from "../actions/BRegAction.js";

/**
 * Bn: Binary Register
 */
export class BReg {
    constructor() {
        this.pointer = 0;
        /** 
         * @private
         * @type {(0 | 1)[]}
         */
        this.bits = [0];
    }

    /**
     * 
     * @param {BRegAction} act 
     * @returns {0 | 1 | void}
     */
    action(act) {
        switch (act.op) {
            case "INC": return this.inc();
            case "READ": return this.read();
            case "TDEC": return this.tdec();
            case "SET": return this.set();
            default: throw Error('BReg action: ' + act.op);
        }
    }

    /**
     * @returns {(0 | 1)[]}
     */
    getBits() {
        return this.bits;
    }

    /**
     * @returns {void}
     */
    inc() {
        this.pointer += 1;
        this.extend();
    }

    /**
     * @returns {0 | 1}
     */
    tdec() {
        if (this.pointer === 0) {
            return 0;
        } else {
            this.pointer -= 1;
            return 1;
        }
    }

    /**
     * @returns {0 | 1}
     */
    read() {
        if (this.pointer < this.bits.length) {
            const value = this.bits[this.pointer];
            this.bits[this.pointer] = 0;
            return value ?? this.error();
        } else {
            return 0;
        }      
    }

    /**
     * 
     * @returns {void}
     */
    set() {
        if (this.pointer < this.bits.length) {
            const value = this.bits[this.pointer];
            if (value === 1) {
                throw Error('BReg error');
            }
            this.bits[this.pointer] = 1;
        } else {
            this.bits = [...this.bits, ...Array(this.pointer - this.bits.length + 1).fill(0)];
            this.bits[this.pointer] = 1;
        }
    }

    extend() {
        if (this.pointer >= this.bits.length) {
            this.bits = [...this.bits, ...Array(this.pointer - this.bits.length + 1).fill(0)];
        }
    }

    /**
     * @returns {never}
     */
    error() {
        throw Error('error');
    }

    /**
     * 
     * @returns {string}
     */
    getBinaryString() {
        return this.getBits().slice().reverse().join("");
    }

    /**
     * 
     * @returns {{
        prefix: (0 | 1)[];
        head: 0 | 1;
        suffix: (0 | 1)[];
    }}
     */
    toObject() {
        this.extend();
        return {
            prefix: this.bits.slice(0, this.pointer),
            head: this.bits[this.pointer] ?? this.error(),
            suffix: this.bits.slice(this.pointer + 1),
        };
    }
}
