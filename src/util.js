/**
 * @param {never} value
 * @returns {never}
 */
export function assertNever(value) {
    throw new Error(`Unexpected value: ${value}`);
}
