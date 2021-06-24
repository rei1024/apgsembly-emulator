// @ts-check

/**
 * Un: Sliding Block Register
 */
export class UReg {
    constructor() {
        /**
         * @private
         */
        this.value = 0;
    }

    /**
     * @returns {number}
     */
    getValue() {
        return this.value;
    }

    /**
     * @returns {void}
     */
    inc() {
        this.value += 1;
    }

    /**
     * @returns {0 | 1}
     */
    tdec() {
        if (this.value === 0) {
            return 0;
        } else {
            this.value -= 1;
            return 1;
        }
    }
}
