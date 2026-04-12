// @ts-check

/**
 * @param {import('../Command.js').RegistersHeader} registersHeader
 * @returns {import('../ActionExecutor.js').RegistersInit}
 */
export function parseRegistersHeader(registersHeader) {
    // Pythonのevalと合わせるためシングルクォーテーションを変換
    /** @type {string} */
    const str = registersHeader.content.replace(/'/ug, `"`);

    /** @type {import("../ActionExecutor.js").RegistersInit} */
    let parsed = {};
    try {
        parsed = JSON.parse(str);
    } catch (_e) {
        throw new Error(`Invalid #REGISTERS: is not a valid JSON: "${str}"`);
    }
    if (parsed === null || typeof parsed !== "object") {
        throw new Error(`Invalid #REGISTERS: "${str}" is not an object`);
    }

    return parsed;
}
