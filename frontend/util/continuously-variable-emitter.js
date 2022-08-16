// @ts-check

export class CVEEvent extends Event {
    /**
     * @param {number} value
     */
    constructor(value) {
        super("emit");

        /**
         * integer
         */
        this.value = value;
    }
}

/**
 * 連続可変エミッター
 */
export class CVE extends EventTarget {
    /**
     * 作成時は非活性状態
     * @param {{ frequency: number, signal?: AbortSignal }} param0
     */
    constructor({ frequency, signal }) {
        super();

        /**
         * frequency of update
         * 周波数[Hz]
         * @private
         */
        this._frequency = frequency;

        /**
         * @private
         */
        this._enabled = false;

        /**
         * @private
         */
        this._fractionStep = 0;

        /**
         * @private
         */
        this._prevTime = -1;

        /**
         * requestAnimationFrameは0を返さない
         * https://html.spec.whatwg.org/multipage/imagebitmap-and-animations.html#animation-frames
         * @private
         * @type {number}
         */
        this._rafID = 0;

        /**
         *
         * @param {number} time
         */
        const update = time => {
            if (this._enabled && this._prevTime !== -1) {
                const diff = time - this._prevTime;
                const prevFractionStep = this._fractionStep;
                this._fractionStep += (diff / 1000) * this._frequency;
                const value = Math.floor(this._fractionStep) - Math.floor(prevFractionStep);
                this.dispatchEvent(new CVEEvent(value));
            }

            this._prevTime = time;
            this._rafID = requestAnimationFrame(update);
        };

        this._rafID = requestAnimationFrame(update);

        if (signal !== undefined) {
            signal.addEventListener('abort', () => {
                this.abort();
            });
        }
    }

    abort() {
        if (this._rafID !== 0) {
            cancelAnimationFrame(this._rafID);
        }
    }

    /**
     * @returns {number}
     */
    get frequency() {
        return this._frequency;
    }

    /**
     * @param {number} frequency
     */
    set frequency(frequency) {
        this._frequency = frequency;
    }

    get disabled() {
        return !this._enabled;
    }

    /**
     * @param {boolean} value
     */
    set disabled(value) {
        this._enabled = !value;
    }

    enable() {
        this._enabled = true;
    }

    disable() {
        this._enabled = false;
    }

    reset() {
        this._fractionStep = 0;
    }
}
