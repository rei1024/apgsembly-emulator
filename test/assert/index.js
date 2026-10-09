// @ts-check

import { expect } from "vitest";

/**
 * @param {unknown} a
 * @param {unknown} b
 */
export function assertEquals(a, b) {
    expect(a).toEqual(b);
}

/**
 * @param {() => void} fn
 * @param {unknown} [_ErrorClass]
 * @param {string} [message]
 */
export function assertThrows(fn, _ErrorClass = undefined, message = undefined) {
    expect(fn).toThrow(message);
}

/**
 * @param {unknown} error
 * @param {unknown} _klass
 * @param {string} _message
 */
export function assertIsError(error, _klass = null, _message = "") {
    if (error instanceof Error) {
        return;
    }
    throw new Error("Expect error");
    // TODO: Implement klass and message checks
}
