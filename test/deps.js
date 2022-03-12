export {
    assertEquals,
    assertThrows,
    assertIsError
} from "https://deno.land/std@0.129.0/testing/asserts.ts";

/**
 *
 * @param {string} name
 * @param {() => void} fn
 * @returns {void}
 */
export function test(name, fn) {
    return Deno.test(name, fn);
}
