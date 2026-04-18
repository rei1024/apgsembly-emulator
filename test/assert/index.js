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
 * @param {unknown} [ErrorClass]
 * @param {string} [message]
 */
export function assertThrows(fn, ErrorClass = undefined, message = undefined) {
    expect(fn).toThrow(message);
}

/**
 * @param {unknown} error
 */
export function assertIsError(error) {
    if (error instanceof Error) {
        return;
    }
    throw new Error("Expect error");
}
